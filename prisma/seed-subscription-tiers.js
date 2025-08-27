const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding subscription tiers...');

  // Create subscription tiers
  const tiers = [
    {
      name: 'free',
      displayName: 'Free Tier',
      description: 'Get started with mental health support',
      price: 0.00,
      currency: 'USD',
      billingCycle: 'forever',
      features: JSON.stringify([
        'Access to basic mental health resources',
        'Community support forums',
        'Basic mood tracking',
        'Limited meditation sessions',
        'Educational content library'
      ]),
      limits: JSON.stringify({
        jamieUsageLimit: 0,
        jamieResetFrequency: 'never',
        conversationsPerMonth: 5,
        aiFeaturesPerMonth: 0
      }),
      jamieAccess: false,
      isActive: true
    },
    {
      name: 'basic',
      displayName: 'Basic Support',
      description: 'Essential mental health tools and AI support',
      price: 9.99,
      currency: 'USD',
      billingCycle: 'monthly',
      features: JSON.stringify([
        'Everything in Free',
        'Access to Jamie AI (50 conversations/month)',
        'Advanced mood tracking',
        'Personalized insights',
        'Priority community support',
        'Extended meditation library'
      ]),
      limits: JSON.stringify({
        jamieUsageLimit: 50,
        jamieResetFrequency: 'monthly',
        conversationsPerMonth: 100,
        aiFeaturesPerMonth: 50
      }),
      jamieAccess: true,
      isActive: true
    },
    {
      name: 'premium',
      displayName: 'Premium Care',
      description: 'Comprehensive mental health support with unlimited AI access',
      price: 24.99,
      currency: 'USD',
      billingCycle: 'monthly',
      features: JSON.stringify([
        'Everything in Basic',
        'Unlimited Jamie AI conversations',
        'Advanced therapeutic techniques',
        'Personalized therapy plans',
        'Crisis intervention support',
        'Family account sharing (up to 3 users)',
        'Priority customer support',
        'Advanced analytics and insights'
      ]),
      limits: JSON.stringify({
        jamieUsageLimit: -1, // Unlimited
        jamieResetFrequency: 'monthly',
        conversationsPerMonth: -1, // Unlimited
        aiFeaturesPerMonth: -1 // Unlimited
      }),
      jamieAccess: true,
      isActive: true
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise Solutions',
      description: 'Custom solutions for organizations and healthcare providers',
      price: 99.99,
      currency: 'USD',
      billingCycle: 'monthly',
      features: JSON.stringify([
        'Everything in Premium',
        'White-label solutions',
        'Custom integrations',
        'Advanced analytics dashboard',
        'Dedicated support team',
        'Compliance certifications (HIPAA, GDPR)',
        'Custom training and onboarding',
        'API access for developers'
      ]),
      limits: JSON.stringify({
        jamieUsageLimit: -1, // Unlimited
        jamieResetFrequency: 'monthly',
        conversationsPerMonth: -1, // Unlimited
        aiFeaturesPerMonth: -1 // Unlimited
      }),
      jamieAccess: true,
      isActive: true
    }
  ];

  for (const tier of tiers) {
    await prisma.subscriptionTier.upsert({
      where: { name: tier.name },
      update: tier,
      create: tier
    });
    console.log(`✅ Created/Updated tier: ${tier.displayName}`);
  }

  // Create a creator account for you (the developer)
  console.log('👑 Creating creator account...');
  
  const creatorEmail = 'michael.robins938@gmail.com'; // Your email
  const creatorUser = await prisma.user.upsert({
    where: { email: creatorEmail },
    update: {
      isCreator: true,
      isAdmin: true,
      subscriptionTier: 'enterprise',
      jamieAccess: true,
      jamieUsageLimit: -1,
      jamieUsageCount: 0
    },
    create: {
      name: 'Micha (Creator)',
      email: creatorEmail,
             password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // Noxerebus6466
      isCreator: true,
      isAdmin: true,
      subscriptionTier: 'enterprise',
      jamieAccess: true,
      jamieUsageLimit: -1,
      jamieUsageCount: 0
    }
  });

  console.log(`✅ Creator account created: ${creatorUser.email}`);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
