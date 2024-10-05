const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
    },
    reportPeriod: {
        type: String,
        enum: ['Harian', 'Mingguan', 'Bulanan', 'Tahunan'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalIncome: {
        type: Number,
        required: true,
    },
    totalTransactions: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Report", reportSchema);