// Fine-tuning 관리 API
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { action, fileId, model } = await request.json();

    switch (action) {
      case 'upload_file':
        return await uploadTrainingFile();
      case 'create_job':
        return await createFineTuningJob(fileId);
      case 'list_jobs':
        return await listFineTuningJobs();
      case 'get_job':
        return await getFineTuningJob(model);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Fine-tuning API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 1. 훈련 파일 업로드
async function uploadTrainingFile() {
  const fs = require('fs');
  const FormData = require('form-data');
  
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream('./training_data/daejeon_travel_training.jsonl'));
    form.append('purpose', 'fine-tune');

    const response = await fetch('https://api.openai.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders()
      },
      body: form
    });

    const data = await response.json();
    console.log('File uploaded:', data);
    
    return NextResponse.json({ 
      success: true, 
      fileId: data.id,
      message: 'Training file uploaded successfully'
    });
  } catch (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
}

// 2. Fine-tuning 작업 생성
async function createFineTuningJob(fileId) {
  try {
    const response = await fetch('https://api.openai.com/v1/fine_tuning/jobs', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        training_file: fileId,
        model: 'gpt-3.5-turbo-1106', // Fine-tuning 지원 모델
        hyperparameters: {
          n_epochs: 3, // 에포크 수 (1-50)
          batch_size: 'auto', // 배치 크기
          learning_rate_multiplier: 'auto' // 학습률
        },
        suffix: 'daejeon-travel-guide' // 모델 이름 접미사
      })
    });

    const data = await response.json();
    console.log('Fine-tuning job created:', data);
    
    return NextResponse.json({ 
      success: true, 
      jobId: data.id,
      status: data.status,
      message: 'Fine-tuning job started'
    });
  } catch (error) {
    throw new Error(`Fine-tuning job creation failed: ${error.message}`);
  }
}

// 3. Fine-tuning 작업 목록 조회
async function listFineTuningJobs() {
  try {
    const response = await fetch('https://api.openai.com/v1/fine_tuning/jobs', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      }
    });

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      jobs: data.data,
      message: 'Fine-tuning jobs retrieved'
    });
  } catch (error) {
    throw new Error(`Failed to list jobs: ${error.message}`);
  }
}

// 4. 특정 Fine-tuning 작업 상태 조회
async function getFineTuningJob(jobId) {
  try {
    const response = await fetch(`https://api.openai.com/v1/fine_tuning/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      }
    });

    const data = await response.json();
    
    return NextResponse.json({ 
      success: true, 
      job: data,
      status: data.status,
      fine_tuned_model: data.fine_tuned_model || null
    });
  } catch (error) {
    throw new Error(`Failed to get job: ${error.message}`);
  }
}

export async function GET(request) {
  // Fine-tuning 작업 목록 조회
  return await listFineTuningJobs();
}