/**
 * Cloudinary 이미지 업로드 유틸리티
 * Firebase 대신 Cloudinary를 사용하여 이미지를 업로드합니다.
 * 완전 무료 tier: 25GB 저장소, 25GB 월 대역폭
 */

// Cloudinary 설정 (클라이언트 사이드에서 접근 가능)
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/**
 * 여행 사진 업로드 (Cloudinary)
 * @param {File} file - 업로드할 파일
 * @param {string} agencyId - 에이전시 ID
 * @returns {Promise<string>} - 업로드된 이미지의 URL
 */
export const uploadTravelPhoto = async (file, agencyId) => {
  try {
    // 파일 검증
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB 제한 (Cloudinary 기본값)
      throw new Error('파일 크기는 10MB 이하여야 합니다.');
    }

    // Cloudinary 설정 확인
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary 설정이 필요합니다. 환경변수를 확인해주세요.');
    }

    // FormData 준비
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    // Cloudinary에 업로드
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`업로드 실패: ${errorData.error?.message || errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // 최적화된 URL 반환 (자동 압축, WebP 변환)
    return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
  } catch (error) {
    throw error;
  }
};

/**
 * 프로필 이미지 업로드 (Cloudinary)
 * @param {File} file - 업로드할 파일
 * @param {string} agencyId - 에이전시 ID
 * @returns {Promise<string>} - 업로드된 이미지의 URL
 */
export const uploadProfilePhoto = async (file, agencyId) => {
  try {
    // 파일 검증
    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드 가능합니다.');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB 제한
      throw new Error('프로필 이미지는 5MB 이하여야 합니다.');
    }

    // Cloudinary 설정 확인
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary 설정이 필요합니다. 환경변수를 확인해주세요.');
    }

    // FormData 준비
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    // 프로필 이미지 폴더
    formData.append('folder', `agencies/${agencyId}/profile`);
    formData.append('public_id', 'profile'); // 프로필은 고정 이름으로

    // Cloudinary에 업로드
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`업로드 실패: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    // 프로필 이미지는 원형으로 크롭하여 반환
    return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_400,h_400,c_fill,g_face/');
  } catch (error) {
    throw error;
  }
};

/**
 * 배경 이미지 업로드 (Cloudinary)
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} agencyId - 에이전시 ID
 * @returns {Promise<string>} - 업로드된 이미지 URL
 */
export const uploadBackgroundImage = async (file, agencyId) => {
  try {
    // 파일 유효성 검사
    if (!file) {
      throw new Error('업로드할 파일이 없습니다.');
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('파일 크기는 5MB 이하여야 합니다.');
    }

    // 지원하는 파일 형식 확인
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('지원하지 않는 파일 형식입니다. (JPEG, PNG, WebP만 가능)');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('public_id', `agencies/${agencyId}/background/background`);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`업로드 실패: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // 배경 이미지는 와이드 비율로 최적화하여 반환
    return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1200,h_400,c_fill/');
  } catch (error) {
    throw error;
  }
};

/**
 * 이미지 삭제 (Cloudinary)
 * @param {string} imageUrl - 삭제할 이미지 URL
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Cloudinary 관리자 API 필요 (서버사이드에서 구현 예정)
    // 현재는 URL만 DB에서 제거하고, 실제 파일은 Cloudinary 콘솔에서 관리
  } catch (error) {
    throw error;
  }
};

/**
 * 파일 크기를 읽기 쉬운 형태로 변환
 * @param {number} bytes - 파일 크기 (바이트)
 * @returns {string} - 변환된 파일 크기 문자열
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Cloudinary URL에서 다양한 변환 적용
 * @param {string} url - 원본 Cloudinary URL
 * @param {string} transformations - 변환 파라미터
 * @returns {string} - 변환된 URL
 */
export const getOptimizedImageUrl = (url, transformations = 'f_auto,q_auto') => {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Cloudinary URL이 아니면 그대로 반환
  }
  
  return url.replace('/upload/', `/upload/${transformations}/`);
};

/**
 * 썸네일 URL 생성
 * @param {string} url - 원본 Cloudinary URL
 * @param {number} width - 너비
 * @param {number} height - 높이
 * @returns {string} - 썸네일 URL
 */
export const getThumbnailUrl = (url, width = 300, height = 300) => {
  return getOptimizedImageUrl(url, `f_auto,q_auto,w_${width},h_${height},c_fill`);
};