const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Comment = require('../models/comment');

async function runCommentBenchmark() {
    await connectDB();
    try {

        const parentWithReplies = await Comment.findOne({ parentComment: { $ne: null } });
        
        if (!parentWithReplies) {
            throw new Error("Không tìm thấy dữ liệu bình luận con để thực hiện thử nghiệm!");
        }

        const parentId = parentWithReplies.parentComment;
        console.log(`Bắt đầu benchmark truy xuất phản hồi cho Parent ID: ${parentId}\n`);

        console.log("--- Giai đoạn 1: Truy xuất khi KHÔNG có Index ---");
        try {
            await Comment.collection.dropIndex("comments_by_parent_idx");
        } catch (e) {
            console.log("Index chưa tồn tại hoặc đã bị xóa.");
        }
        
        const statsNoIndex = await getCommentExecutionStats(parentId);
        printCommentStats(statsNoIndex);

        console.log("\n--- Giai đoạn 2: Truy xuất SAU KHI tối ưu Index ---");
        await Comment.collection.createIndex(
            { parentComment: 1 }, 
            { name: "comments_by_parent_idx" }
        );
        console.log("Đã tạo Index { parentComment: 1 }.");

        const statsWithIndex = await getCommentExecutionStats(parentId);
        printCommentStats(statsWithIndex);
        console.log("\nKẾT LUẬN HIỆU NĂNG TRUY XUẤT BÌNH LUẬN:");

        const timeNoIdx = statsNoIndex.executionTimeMillis || 1;
        const timeWithIdx = statsWithIndex.executionTimeMillis || 0.1; 
        const speedUp = (timeNoIdx / timeWithIdx).toFixed(2);

        console.log(`- Chiến lược chuyển từ [${statsNoIndex.winningPlan}] sang [${statsWithIndex.winningPlan}]`);
        console.log(`- Thời gian xử lý tại DB giảm từ ${timeNoIdx}ms xuống ${statsWithIndex.executionTimeMillis}ms`);
        console.log(`- Tốc độ cải thiện: ~${speedUp} lần`);
        console.log(`- Số lượng tài liệu phải quét bộ nhớ giảm: ${statsNoIndex.totalDocsExamined - statsWithIndex.totalDocsExamined} bản ghi`);

    } catch (error) {
        console.error("Lỗi thử nghiệm:", error);
    } finally {
        await mongoose.disconnect();
        console.log("\nĐã ngắt kết nối database.");
    }
}

async function getCommentExecutionStats(parentId) {

    const explain = await Comment.find({ parentComment: parentId })
        .explain("executionStats");

    const stats = explain.executionStats;

    const winningStage = explain.queryPlanner.winningPlan.stage;

    return {
        executionTimeMillis: stats.executionTimeMillis,
        totalKeysExamined: stats.totalKeysExamined,
        totalDocsExamined: stats.totalDocsExamined,
        nReturned: stats.nReturned,
        winningPlan: winningStage
    };
}

function printCommentStats(s) {
    console.table([{
        "Stage": s.winningPlan,
        "Thời gian (ms)": s.executionTimeMillis,
        "Index đã quét": s.totalKeysExamined,
        "Bản ghi đã quét": s.totalDocsExamined,
        "Results": s.nReturned
    }]);
}

runCommentBenchmark();