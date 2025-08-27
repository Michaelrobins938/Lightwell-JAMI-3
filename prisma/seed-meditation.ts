import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding meditation data...');

  // Create meditation categories
  const categories = await Promise.all([
    prisma.meditationCategory.upsert({
      where: { name: 'mindfulness' },
      update: {},
      create: {
        name: 'mindfulness',
        
      }
    }),
    prisma.meditationCategory.upsert({
      where: { name: 'breathing' },
      update: {},
      create: {
        name: 'breathing',
        description: 'Breathing exercises and techniques'
      }
    }),
    prisma.meditationCategory.upsert({
      where: { name: 'sleep' },
      update: {},
      create: {
        name: 'sleep',
        description: 'Sleep support and relaxation'
      }
    }),
    prisma.meditationCategory.upsert({
      where: { name: 'stress' },
      update: {},
      create: {
        name: 'stress',
        description: 'Stress relief and anxiety management'
      }
    })
  ]);

  // Create meditation instructors
  const instructors = await Promise.all([
    prisma.meditationInstructor.upsert({
      where: { name: 'Dr. Sarah Chen' },
      update: {
        credentials: 'PhD in Clinical Psychology, Certified Mindfulness Instructor',
        bio: 'Specialist in mindfulness-based stress reduction and cognitive behavioral therapy.',
        avatar: '/api/placeholder/avatar/sarah-chen'
      },
      create: {
        name: 'Dr. Sarah Chen',
        credentials: 'PhD in Clinical Psychology, Certified Mindfulness Instructor',
        bio: 'Specialist in mindfulness-based stress reduction and cognitive behavioral therapy.',
        avatar: '/api/placeholder/avatar/sarah-chen'
      }
    }),
    prisma.meditationInstructor.upsert({
      where: { name: 'Dr. Michael Torres' },
      update: {
        credentials: 'Licensed Clinical Psychologist, Sleep Specialist',
        bio: 'Expert in sleep disorders and relaxation techniques for better rest.',
        avatar: '/api/placeholder/avatar/michael-torres'
      },
      create: {
        name: 'Dr. Michael Torres',
        credentials: 'Licensed Clinical Psychologist, Sleep Specialist',
        bio: 'Expert in sleep disorders and relaxation techniques for better rest.',
        avatar: '/api/placeholder/avatar/michael-torres'
      }
    }),
    prisma.meditationInstructor.upsert({
      where: { name: 'Dr. Emma Wilson' },
      update: {
        credentials: 'MSc in Psychology, Certified Breathwork Instructor',
        bio: 'Specialist in breathing techniques and somatic therapy.',
        avatar: '/api/placeholder/avatar/emma-wilson'
      },
      create: {
        name: 'Dr. Emma Wilson',
        credentials: 'MSc in Psychology, Certified Breathwork Instructor',
        bio: 'Specialist in breathing techniques and somatic therapy.',
        avatar: '/api/placeholder/avatar/emma-wilson'
      }
    }),
    prisma.meditationInstructor.upsert({
      where: { name: 'Dr. James Rodriguez' },
      update: {
        credentials: 'PhD in Clinical Psychology, Anxiety Specialist',
        bio: 'Expert in anxiety disorders and stress management techniques.',
        avatar: '/api/placeholder/avatar/james-rodriguez'
      },
      create: {
        name: 'Dr. James Rodriguez',
        credentials: 'PhD in Clinical Psychology, Anxiety Specialist',
        bio: 'Expert in anxiety disorders and stress management techniques.',
        avatar: '/api/placeholder/avatar/james-rodriguez'
      }
    }),
    prisma.meditationInstructor.upsert({
      where: { name: 'Dr. Lisa Park' },
      update: {
        credentials: 'Licensed Psychologist, Body-Mind Integration Specialist',
        bio: 'Specialist in body scan meditation and somatic awareness.',
        avatar: '/api/placeholder/avatar/lisa-park'
      },
      create: {
        name: 'Dr. Lisa Park',
        credentials: 'Licensed Psychologist, Body-Mind Integration Specialist',
        bio: 'Specialist in body scan meditation and somatic awareness.',
        avatar: '/api/placeholder/avatar/lisa-park'
      }
    }),
    prisma.meditationInstructor.upsert({
      where: { name: 'Dr. Alex Thompson' },
      update: {
        credentials: 'MSc in Neuroscience, Focus and Concentration Expert',
        bio: 'Specialist in attention training and cognitive enhancement.',
        avatar: '/api/placeholder/avatar/alex-thompson'
      },
      create: {
        name: 'Dr. Alex Thompson',
        credentials: 'MSc in Neuroscience, Focus and Concentration Expert',
        bio: 'Specialist in attention training and cognitive enhancement.',
        avatar: '/api/placeholder/avatar/alex-thompson'
      }
    })
  ]);

  // Create meditation tags
  const tags = await Promise.all([
    prisma.meditationTag.upsert({
      where: { name: 'morning' },
      update: {},
      create: { name: 'morning' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'mindfulness' },
      update: {},
      create: { name: 'mindfulness' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'breathing' },
      update: {},
      create: { name: 'breathing' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'sleep' },
      update: {},
      create: { name: 'sleep' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'relaxation' },
      update: {},
      create: { name: 'relaxation' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'night' },
      update: {},
      create: { name: 'night' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'stress' },
      update: {},
      create: { name: 'stress' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'calm' },
      update: {},
      create: { name: 'calm' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'anxiety' },
      update: {},
      create: { name: 'anxiety' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'relief' },
      update: {},
      create: { name: 'relief' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'body' },
      update: {},
      create: { name: 'body' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'awareness' },
      update: {},
      create: { name: 'awareness' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'focus' },
      update: {},
      create: { name: 'focus' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'quick' },
      update: {},
      create: { name: 'quick' }
    }),
    prisma.meditationTag.upsert({
      where: { name: 'clarity' },
      update: {},
      create: { name: 'clarity' }
    })
  ]);

  // Create meditation sessions
  const sessions = await Promise.all([
    prisma.meditationSession.create({
      data: {
        title: 'Morning Mindfulness',
        description: 'Start your day with clarity and purpose through gentle breathing and mindful awareness.',
        duration: 10,
        difficulty: 'beginner',
        thumbnailUrl: '/api/placeholder/300/200',
        audioUrl: '/api/placeholder/audio/morning-mindfulness',
        averageRating: 4.8,
        categoryId: categories[0].id, // mindfulness
        instructorId: instructors[0].id, // Dr. Sarah Chen
        tags: {
          create: [
            { tagId: tags[0].id }, // morning
            { tagId: tags[1].id }, // mindfulness
            { tagId: tags[2].id }  // breathing
          ]
        }
      }
    }),
    prisma.meditationSession.create({
      data: {
        title: 'Deep Sleep Meditation',
        description: 'Drift into peaceful sleep with guided relaxation and soothing nature sounds.',
        duration: 20,
        difficulty: 'beginner',
        thumbnailUrl: '/api/placeholder/300/200',
        audioUrl: '/api/placeholder/audio/deep-sleep',
        averageRating: 4.9,
        categoryId: categories[2].id, // sleep
        instructorId: instructors[1].id, // Dr. Michael Torres
        tags: {
          create: [
            { tagId: tags[3].id }, // sleep
            { tagId: tags[4].id }, // relaxation
            { tagId: tags[5].id }  // night
          ]
        }
      }
    }),
    prisma.meditationSession.create({
      data: {
        title: 'Stress Relief Breathing',
        description: 'Release tension and find calm through focused breathing techniques.',
        duration: 15,
        difficulty: 'intermediate',
        thumbnailUrl: '/api/placeholder/300/200',
        audioUrl: '/api/placeholder/audio/stress-relief',
        averageRating: 4.7,
        categoryId: categories[1].id, // breathing
        instructorId: instructors[2].id, // Dr. Emma Wilson
        tags: {
          create: [
            { tagId: tags[6].id }, // stress
            { tagId: tags[2].id }, // breathing
            { tagId: tags[7].id }  // calm
          ]
        }
      }
    }),
    prisma.meditationSession.create({
      data: {
        title: 'Anxiety Relief Session',
        description: 'Combat anxiety with proven techniques and gentle guidance.',
        duration: 25,
        difficulty: 'intermediate',
        thumbnailUrl: '/api/placeholder/300/200',
        audioUrl: '/api/placeholder/audio/anxiety-relief',
        averageRating: 4.6,
        categoryId: categories[3].id, // stress
        instructorId: instructors[3].id, // Dr. James Rodriguez
        tags: {
          create: [
            { tagId: tags[8].id }, // anxiety
            { tagId: tags[7].id }, // calm
            { tagId: tags[9].id }  // relief
          ]
        }
      }
    }),
    prisma.meditationSession.create({
      data: {
        title: 'Body Scan Meditation',
        description: 'Connect with your body through progressive relaxation and awareness.',
        duration: 30,
        difficulty: 'advanced',
        thumbnailUrl: '/api/placeholder/300/200',
        audioUrl: '/api/placeholder/audio/body-scan',
        averageRating: 4.8,
        categoryId: categories[0].id, // mindfulness
        instructorId: instructors[4].id, // Dr. Lisa Park
        tags: {
          create: [
            { tagId: tags[10].id }, // body
            { tagId: tags[11].id }, // awareness
            { tagId: tags[4].id }   // relaxation
          ]
        }
      }
    }),
    prisma.meditationSession.create({
      data: {
        title: 'Quick Focus Boost',
        description: 'Enhance concentration and mental clarity in just 5 minutes.',
        duration: 5,
        difficulty: 'beginner',
        thumbnailUrl: '/api/placeholder/300/200',
        audioUrl: '/api/placeholder/audio/focus-boost',
        averageRating: 4.5,
        categoryId: categories[0].id, // mindfulness
        instructorId: instructors[5].id, // Dr. Alex Thompson
        tags: {
          create: [
            { tagId: tags[12].id }, // focus
            { tagId: tags[13].id }, // quick
            { tagId: tags[14].id }  // clarity
          ]
        }
      }
    })
  ]);

  // Note: Play data will be created when real users interact with sessions
  console.log(`Created ${sessions.length} meditation sessions`);

  console.log('Meditation data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 