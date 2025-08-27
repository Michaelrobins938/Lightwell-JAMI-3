# UI/UX Specifications

This document outlines the design and implementation details for key UI/UX features.

---

## 1. Voice Mode UI

This section details the animations and styling for the voice interaction mode.

### 1.1. Input Bar → Orb Transformation

-   **Trigger**: User clicks the "Voice Mode" icon.
-   **Animation**: The input bar collapses into a circular orb.
-   **Element**: `#input-bar`
-   **CSS Transition**: `transform: scaleX(0), width: 40px; opacity: 0;` -> `transform: scaleX(1), width: 100%; opacity: 1;` (reverse for orb)
-   **Duration**: `300ms`
-   **Easing**: `ease-out`

### 1.2. Orb Breathing Animation

-   **State**: Active when the AI is listening or processing voice input.
-   **Element**: `#voice-orb`
-   **CSS Animation**: A looping animation to provide feedback that the system is active.
    ```css
    @keyframes breathe {
      0%, 100% { transform: scale(1); box-shadow: 0 0 5px rgba(0, 123, 255, 0.4); }
      50% { transform: scale(1.05); box-shadow: 0 0 15px rgba(0, 123, 255, 0.8); }
    }
    ```
-   **Animation Properties**: `breathe 1200ms ease-in-out infinite`
-   **Loop Duration**: `1200ms`

### 1.3. Transcript Display

-   **Position**: Appears in a dedicated area above the voice orb, fading in line-by-line.
-   **Styling**:
    -   **Font**: `Inter, sans-serif`
    -   **Color**: `#E0E0E0` (user transcript), `#FFFFFF` (AI response)
    -   **Opacity Transition**: New lines fade in with `opacity: 0` to `opacity: 1` over `200ms`.

---

## 2. Memory UI Components

This section covers the interface for managing the AI's memory.

### 2.1. Memory Timeline Viewer

-   **Layout**: A modal or a dedicated page with a vertical timeline.
-   **Component**: `<MemoryTimeline />`
-   **Structure**: Each memory is a `<MemoryCard />` component containing the remembered fact and a timestamp.
-   **Interaction**: Vertical scrolling to navigate through memories.

### 2.2. Memory Editor/Deletion Interface

-   **Location**: Within each `<MemoryCard />`.
-   **Controls**:
    -   An "Edit" (pencil) icon that transforms the text into an input field.
    -   A "Delete" (trash) icon that prompts for confirmation before removal.
-   **State**: The card will have `isEditing` state to toggle view/edit mode.

### 2.3. Memory Confidence Indicators

-   **Visual**: A small, colored dot or a subtle progress bar on the top-right of each `<MemoryCard />`.
-   **Mapping**:
    -   **Green / High**: High confidence
    -   **Yellow / Medium**: Medium confidence
    -   **Red / Low**: Low confidence (may require user correction)
-   **Implementation**: The confidence score will be passed as a prop to the component.

---

## 3. Sidebar Improvements

This section details the implementation of a resizable sidebar.

### 3.1. Drag Handle

-   **Element**: A `<div>` positioned on the right border of the sidebar.
-   **Styling**:
    -   `width: 4px;`
    -   `cursor: col-resize;`
    -   A subtle background color change on hover to indicate it's interactive.

### 3.2. Width Persistence

-   **Mechanism**: `localStorage`
-   **On Drag End**: `localStorage.setItem('sidebarWidth', newWidth);`
-   **On Mount**: The sidebar component will read this value: `const savedWidth = localStorage.getItem('sidebarWidth');` and apply it if it exists.

### 3.3. Smooth Resize Animations

-   **Trigger**: When the sidebar is programmatically opened/closed or snapped to a default width.
-   **CSS Transition**: `transition: width 200ms ease-in-out;`
-   **Note**: The transition should be disabled during the drag-to-resize action to ensure performance and responsiveness, and re-enabled on drag end.
