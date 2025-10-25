const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/studentdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 0 },
  course: { type: String, required: true }
});
const Student = mongoose.model('Student', studentSchema);

// Controller-like functions (inline)
const createStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    return res.status(201).json(saved);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    return res.status(200).json(students);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    return res.status(200).json(student);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    return res.status(200).json({ message: 'Student updated successfully', student: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    return res.status(200).json({ message: 'Student deleted successfully', student: deleted });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid ID' });
  }
};

// Routes (inline)
app.post('/students', createStudent);
app.get('/students', getAllStudents);
app.get('/students/:id', getStudentById);
app.put('/students/:id', updateStudent);
app.delete('/students/:id', deleteStudent);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
