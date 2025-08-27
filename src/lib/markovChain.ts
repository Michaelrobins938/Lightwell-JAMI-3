export interface MarkovState {
  id: string;
  probability: number;
  metadata?: Record<string, any>;
}

export interface MarkovTransition {
  fromState: string;
  toState: string;
  probability: number;
  context?: Record<string, any>;
  timestamp?: Date;
}

export interface MarkovChainConfig {
  states: string[];
  initialTransitions?: MarkovTransition[];
  decayFactor?: number; // How quickly old transitions lose weight
  minProbability?: number; // Minimum probability threshold
  maxMemory?: number; // Maximum number of transitions to remember
}

export class MarkovChain {
  private states: Set<string>;
  private transitionMatrix: Map<string, Map<string, number>>;
  private transitionHistory: MarkovTransition[];
  private config: MarkovChainConfig;
  private stateCounts: Map<string, number>;

  constructor(config: MarkovChainConfig) {
    this.states = new Set(config.states);
    this.transitionMatrix = new Map();
    this.transitionHistory = config.initialTransitions || [];
    this.config = {
      decayFactor: 0.95,
      minProbability: 0.01,
      maxMemory: 1000,
      ...config
    };
    this.stateCounts = new Map();
    
    this.initializeMatrix();
    this.updateMatrixFromHistory();
  }

  private initializeMatrix(): void {
    // Initialize transition matrix with equal probabilities
    this.states.forEach(state => {
      const transitions = new Map<string, number>();
      this.states.forEach(targetState => {
        transitions.set(targetState, 1 / this.states.size);
      });
      this.transitionMatrix.set(state, transitions);
    });
  }

  private updateMatrixFromHistory(): void {
    // Clear existing counts
    this.stateCounts.clear();
    
    // Count transitions
    for (const transition of this.transitionHistory) {
      const currentCount = this.stateCounts.get(transition.fromState) || 0;
      this.stateCounts.set(transition.fromState, currentCount + 1);
      
      const transitions = this.transitionMatrix.get(transition.fromState);
      if (transitions) {
        const currentProb = transitions.get(transition.toState) || 0;
        transitions.set(transition.toState, currentProb + transition.probability);
      }
    }

    // Normalize probabilities
    this.normalizeProbabilities();
  }

  private normalizeProbabilities(): void {
    this.transitionMatrix.forEach((transitions, fromState) => {
      const totalCount = this.stateCounts.get(fromState) || 1;
      const totalProbability = Array.from(transitions.values()).reduce((sum, prob) => sum + prob, 0);
      
      if (totalProbability > 0) {
        transitions.forEach((probability, toState) => {
          const normalizedProb = (probability / totalProbability) * (totalCount / (totalCount + 1));
          transitions.set(toState, Math.max(this.config.minProbability!, normalizedProb));
        });
      }
    });
  }

  public addTransition(transition: MarkovTransition): void {
    // Add timestamp if not provided
    if (!transition.timestamp) {
      transition.timestamp = new Date();
    }

    // Add to history
    this.transitionHistory.push(transition);
    
    // Limit memory
    if (this.transitionHistory.length > this.config.maxMemory!) {
      this.transitionHistory = this.transitionHistory.slice(-this.config.maxMemory!);
    }

    // Update matrix
    this.updateMatrixFromHistory();
  }

  public predictNextState(currentState: string, context?: Record<string, any>): MarkovState[] {
    const transitions = this.transitionMatrix.get(currentState);
    if (!transitions) {
      return [];
    }

    // Get all possible next states with their probabilities
    const predictions: MarkovState[] = [];
    transitions.forEach((probability, toState) => {
      if (probability > this.config.minProbability!) {
        predictions.push({
          id: toState,
          probability,
          metadata: context
        });
      }
    });

    // Sort by probability (highest first)
    predictions.sort((a, b) => b.probability - a.probability);
    return predictions;
  }

  public predictTrajectory(
    startState: string, 
    steps: number, 
    context?: Record<string, any>
  ): Array<{ step: number; state: string; probability: number; confidence: number }> {
    const trajectory: Array<{ step: number; state: string; probability: number; confidence: number }> = [];
    let currentState = startState;
    let cumulativeProbability = 1.0;

    for (let step = 1; step <= steps; step++) {
      const predictions = this.predictNextState(currentState, context);
      
      if (predictions.length === 0) {
        break;
      }

      // Take the most likely next state
      const nextState = predictions[0];
      cumulativeProbability *= nextState.probability;
      
      trajectory.push({
        step,
        state: nextState.id,
        probability: nextState.probability,
        confidence: cumulativeProbability
      });

      currentState = nextState.id;
    }

    return trajectory;
  }

  public getTransitionProbability(fromState: string, toState: string): number {
    const transitions = this.transitionMatrix.get(fromState);
    return transitions?.get(toState) || 0;
  }

  public getStateFrequency(state: string): number {
    return this.stateCounts.get(state) || 0;
  }

  public getMostLikelySequence(
    startState: string, 
    endState: string, 
    maxSteps: number = 10
  ): string[] | null {
    const visited = new Set<string>();
    const queue: Array<{ state: string; path: string[]; probability: number }> = [
      { state: startState, path: [startState], probability: 1.0 }
    ];

    while (queue.length > 0 && queue[0].path.length <= maxSteps) {
      const current = queue.shift()!;
      
      if (current.state === endState) {
        return current.path;
      }

      if (visited.has(current.state)) continue;
      visited.add(current.state);

      const predictions = this.predictNextState(current.state);
      for (const prediction of predictions.slice(0, 3)) { // Top 3 predictions
        const newPath = [...current.path, prediction.id];
        const newProbability = current.probability * prediction.probability;
        
        queue.push({
          state: prediction.id,
          path: newPath,
          probability: newProbability
        });
      }

      // Sort queue by probability
      queue.sort((a, b) => b.probability - a.probability);
    }

    return null;
  }

  public updateFromObservations(observations: string[]): void {
    for (let i = 0; i < observations.length - 1; i++) {
      const fromState = observations[i];
      const toState = observations[i + 1];
      
      this.addTransition({
        fromState,
        toState,
        probability: 1.0
      });
    }
  }

  public getChainStatistics(): {
    totalTransitions: number;
    uniqueStates: number;
    mostFrequentState: string;
    averageTransitionsPerState: number;
  } {
    const totalTransitions = this.transitionHistory.length;
    const uniqueStates = this.states.size;
    const mostFrequentState = Array.from(this.stateCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';
    const averageTransitionsPerState = totalTransitions / Math.max(uniqueStates, 1);

    return {
      totalTransitions,
      uniqueStates,
      mostFrequentState,
      averageTransitionsPerState
    };
  }

  public reset(): void {
    this.transitionHistory = [];
    this.stateCounts.clear();
    this.initializeMatrix();
  }
}