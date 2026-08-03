"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Starting database seeding...");
    // Clean existing tables
    await prisma.notification.deleteMany();
    await prisma.friend.deleteMany();
    await prisma.nFT.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.goal.deleteMany();
    await prisma.studySession.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.user.deleteMany();
    // Create Mock Users
    console.log("Creating users...");
    const alice = await prisma.user.create({
        data: {
            walletAddress: "inj15v634j9q3gq0k2vsl87834p7k3cllzn75fup9a",
            username: "Alice_CryptoCode",
            bio: "Web3 Developer studying Injective Smart Contracts and Rust.",
            avatar: "avatar_2",
            level: 12,
            xp: 7200,
            coins: 450,
            streak: 9,
            lastActiveDate: new Date(),
        },
    });
    const bob = await prisma.user.create({
        data: {
            walletAddress: "inj17lmyg8a48n7w6s3zls6427pj3cxllyn97gxp2b",
            username: "Bob_Algorithms",
            bio: "Preparing for FAANG interview. Solving LeetCode everyday.",
            avatar: "avatar_4",
            level: 9,
            xp: 4100,
            coins: 280,
            streak: 5,
            lastActiveDate: new Date(),
        },
    });
    const charlie = await prisma.user.create({
        data: {
            walletAddress: "inj18ymvxg8w3gq0k2vls47344p7k8cllzn84fxp3c",
            username: "Charlie_DBMS",
            bio: "Computer Science undergraduate focusing on DBMS and OS.",
            avatar: "avatar_6",
            level: 6,
            xp: 2200,
            coins: 130,
            streak: 3,
            lastActiveDate: new Date(),
        },
    });
    console.log("Creating study challenges...");
    // Alice Challenges
    await prisma.challenge.createMany({
        data: [
            {
                title: "Study Injective TS SDK",
                description: "Read official docs and implement query methods.",
                category: "Web3",
                difficulty: "Medium",
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                duration: 90,
                xpReward: 270,
                coinReward: 135,
                status: "COMPLETED",
                completionDate: new Date(),
                txHash: "inj_tx_seed_alice_1",
                userId: alice.id,
            },
            {
                title: "Solve 20 LeetCode Problems",
                description: "Focus on graphs and trees topics.",
                category: "DSA",
                difficulty: "Hard",
                deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
                duration: 120,
                xpReward: 480,
                coinReward: 240,
                status: "COMPLETED",
                completionDate: new Date(),
                txHash: "inj_tx_seed_alice_2",
                userId: alice.id,
            },
        ],
    });
    // Bob Challenges
    await prisma.challenge.createMany({
        data: [
            {
                title: "Study Dynamic Programming",
                description: "Solve DP problems on Knapsack and Grid.",
                category: "DSA",
                difficulty: "Hard",
                deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                duration: 150,
                xpReward: 600,
                coinReward: 300,
                status: "COMPLETED",
                completionDate: new Date(),
                txHash: "inj_tx_seed_bob_1",
                userId: bob.id,
            },
            {
                title: "Revise DBMS Indexing",
                description: "Understand B-Trees and Hash Indexing.",
                category: "DBMS",
                difficulty: "Medium",
                deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                duration: 60,
                xpReward: 180,
                coinReward: 90,
                status: "PENDING",
                userId: bob.id,
            },
        ],
    });
    console.log("Creating study sessions...");
    // Alice Study Sessions (Pomodoros)
    await prisma.studySession.createMany({
        data: [
            {
                duration: 25,
                startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 3 * 60 * 60 * 1000 + 25 * 60 * 1000),
                category: "Web3",
                mode: "25/5",
                synced: true,
                userId: alice.id,
            },
            {
                duration: 50,
                startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 1 * 60 * 60 * 1000 + 50 * 60 * 1000),
                category: "DSA",
                mode: "50/10",
                synced: true,
                userId: alice.id,
            },
        ],
    });
    // Bob Study Sessions
    await prisma.studySession.createMany({
        data: [
            {
                duration: 50,
                startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 50 * 60 * 1000),
                category: "DSA",
                mode: "50/10",
                synced: true,
                userId: bob.id,
            },
        ],
    });
    console.log("Creating achievements...");
    // Alice achievements
    await prisma.achievement.createMany({
        data: [
            {
                title: "First Sprint",
                description: "Complete your first study challenge",
                badgeId: "badge_first_challenge",
                unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                userId: alice.id,
            },
            {
                title: "Habit Builder",
                description: "Maintain a 3-Day study streak",
                badgeId: "badge_streak_3",
                unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                userId: alice.id,
            },
            {
                title: "Unstoppable Focus",
                description: "Maintain a 7-Day study streak",
                badgeId: "badge_streak_7",
                unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                userId: alice.id,
            },
        ],
    });
    // Bob achievements
    await prisma.achievement.createMany({
        data: [
            {
                title: "First Sprint",
                description: "Complete your first study challenge",
                badgeId: "badge_first_challenge",
                unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                userId: bob.id,
            },
            {
                title: "Habit Builder",
                description: "Maintain a 3-Day study streak",
                badgeId: "badge_streak_3",
                unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                userId: bob.id,
            },
        ],
    });
    console.log("Creating NFTs...");
    // Alice NFTs
    await prisma.nFT.createMany({
        data: [
            {
                title: "First Sprint NFT",
                description: "Complete your first study challenge. Proven on Injective.",
                badgeId: "badge_first_challenge",
                ipfsUri: "ipfs://QmSeeda1iceFirstSprintChallengeMetadataUniqueHash",
                txHash: "0x1d36d4bc8ee50f6d6c6e7379d717df3d474542d1ecef68e98348db49b1092aab",
                mintDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                userId: alice.id,
            },
            {
                title: "Habit Builder NFT",
                description: "Maintain a 3-Day study streak. Proven on Injective.",
                badgeId: "badge_streak_3",
                ipfsUri: "ipfs://QmSeeda1iceHabitBuilderStreak3MetadataUniqueHash",
                txHash: "0xa2d36d4bc8ee50f6d6c6e7379d717df3d474542d1ecef68e98348db49b1092ccb",
                mintDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                userId: alice.id,
            },
        ],
    });
    console.log("Creating friendships...");
    await prisma.friend.create({
        data: {
            senderId: alice.id,
            receiverId: bob.id,
            status: "ACCEPTED",
        },
    });
    await prisma.friend.create({
        data: {
            senderId: charlie.id,
            receiverId: alice.id,
            status: "PENDING",
        },
    });
    console.log("Creating initial goals...");
    await prisma.goal.create({
        data: {
            title: "Daily DSA Sprint",
            targetValue: 60,
            currentValue: 50,
            type: "DAILY",
            category: "DSA",
            userId: alice.id,
        },
    });
    await prisma.goal.create({
        data: {
            title: "Weekly Web3 Sprints",
            targetValue: 240,
            currentValue: 115,
            type: "WEEKLY",
            category: "Web3",
            userId: alice.id,
        },
    });
    console.log("🌱 Database seeding completed successfully!");
}
main()
    .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
