const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Post = require('../models/post');
const Community = require('../models/community');

async function runBenchmark() {
    await connectDB();

    try {
        const targetCommunity = await Community.findOne();
        if (!targetCommunity) throw new Error("Không có cộng đồng nào để test!");
        
        const communityId = targetCommunity._id;
        console.log(`Bắt đầu test với Community ID: ${communityId}\n`);

        console.log("--- Giai đoạn 2: Kiểm tra khi KHÔNG có Index ---");

        await Post.collection.dropIndexes(); 
        console.log("Đã xóa toàn bộ Index.");

        const statsNoIndex = await getExecutionStats(communityId);
        printStats(statsNoIndex);

        console.log("\n--- Giai đoạn 3: Kiểm tra SAU KHI tối ưu Index ---");
        await Post.collection.createIndex(
            { community: 1, createdAt: -1 }, 
            { name: "new_feed_sort_idx" }
        );
        console.log("Đã tạo lại Compound Index { community: 1, createdAt: -1 }.");

        const statsWithIndex = await getExecutionStats(communityId);
        printStats(statsWithIndex);

        // --- SO SÁNH KẾT QUẢ ---
        console.log("\nKẾT LUẬN SO SÁNH:");
        const speedUp = (statsNoIndex.executionTimeMillis / (statsWithIndex.executionTimeMillis || 1)).toFixed(2);
        console.log(`- Tốc độ cải thiện: ${speedUp} lần`);
        console.log(`- Bản ghi phải quét giảm: ${statsNoIndex.totalDocsExamined - statsWithIndex.totalDocsExamined} bản ghi`);

    } catch (error) {
        console.error("Lỗi thử nghiệm:", error);
    } finally {
        await mongoose.disconnect();
    }
}

async function getExecutionStats(communityId) {
    const explain = await Post.find({ community: communityId })
        .sort({ createdAt: -1 })
        .limit(20)
        .explain("executionStats");

    const stats = explain.executionStats;
    return {
        executionTimeMillis: stats.executionTimeMillis,
        totalKeysExamined: stats.totalKeysExamined,
        totalDocsExamined: stats.totalDocsExamined,
        nReturned: stats.nReturned,
        winningPlan: explain.queryPlanner.winningPlan.stage
    };
}

function printStats(s) {
    console.table([{
        "Thời gian (ms)": s.executionTimeMillis,
        "Số Index đã quét": s.totalKeysExamined,
        "Số bản ghi đã quét": s.totalDocsExamined,
        "Kết quả trả về": s.nReturned,
        "Chiến lược": s.winningPlan
    }]);
}

runBenchmark();