import mongoose from 'mongoose';
import Student from '../models/Student.js';
import XLSX from 'xlsx';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Read and parse Excel file
const importData = async () => {
  try {
    await connectDB();

    // Load Excel file
    const workbook = XLSX.readFile(path.join(__dirname, 'studentsData.csv'));
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Map Excel data to Student model
    const students = data.map((row) => ({
      regNo: row['REGD.NO'],
      name: row['NAME'],
      se: row['SE'],
      padcom: row['PADCOM'],
      cns: row['CNS'],
      clsa: row['CLSA'],
      tdfsdiii: row['TDFSDIII'],
      iic: row['IIC'],
      seLab: row['SELab'],
      cnsLab: row['CNSLab'],
      adsLab: row['ADSLab'],
      ajpLab: row['AJPLab'],
      qalr: row['QALR'],
      ads: row['ADS'],
      ajp: row['AJP'],
      npteloe: row['NPTELOE'],
      idpii: row['IDPII'],
      cepb: row['cepb'],
      csevac: row['CSEVAC'],
      library: row['library'],
      counseling: row['Counseling'],
      totalPercentage: row['TOTAL%'],
      phoneNumber: row['PhoneNumber']?.toString(),
      parentNumber: row['ParentNumber']?.toString(),
      gpa: row['TOTAL%'] ? row['TOTAL%'] / 25 : 0,
      attendance: 0,
      status: 'On Track',
      marks: [
        { subject: 'SE', score: parseScore(row['SE']) },
        { subject: 'PADCOM', score: parseScore(row['PADCOM']) },
        { subject: 'CNS', score: parseScore(row['CNS']) },
      ].filter((mark) => mark.score !== null),
      goals: [],
      sessionNotes: [],
      flags: [],
    }));

    // Clear existing data (optional)
    await Student.deleteMany({});

    // Insert new data
    await Student.insertMany(students);
    console.log('Data imported successfully:', students.length, 'students');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing data:', error);
    mongoose.connection.close();
  }
};

// Helper function to parse scores like "24(70.59%)" to a number
const parseScore = (scoreStr) => {
  if (!scoreStr) return null;
  const match = scoreStr.match(/\((\d+\.\d+)%\)/);
  return match ? parseFloat(match[1]) : null;
};

importData();