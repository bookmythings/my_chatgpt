import mongoose, { Document, Schema } from 'mongoose';

export interface IFile {
  name: string;
  path: string;
  content: string;
  language: string;
  isFolder: boolean;
  children?: IFile[];
}

export interface IProject extends Document {
  _id: string;
  name: string;
  description?: string;
  language: string;
  template: string;
  owner: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  files: IFile[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastAccessed: Date;
}

const fileSchema = new Schema<IFile>({
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'plaintext'
  },
  isFolder: {
    type: Boolean,
    default: false
  },
  children: [this]
}, { _id: false });

const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  language: {
    type: String,
    required: true,
    enum: ['javascript', 'python', 'html', 'cpp', 'java', 'typescript'],
    default: 'javascript'
  },
  template: {
    type: String,
    required: true,
    enum: ['blank', 'node', 'react', 'python', 'html', 'cpp', 'java'],
    default: 'blank'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  files: [fileSchema],
  isPublic: {
    type: Boolean,
    default: false
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastAccessed on every find
projectSchema.pre(/^find/, function() {
  this.set({ lastAccessed: new Date() });
});

export const Project = mongoose.model<IProject>('Project', projectSchema);