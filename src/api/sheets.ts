// Chú ý: Thay URL này sau khi bạn Deploy Google Apps Script (Tôi sẽ hướng dẫn ở cuối)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-ZHIwmy3vZ2zNWOuzXsZ6XIybiLJdqckhLN0mFexs1u7BnynWKSaHMZo6gGxtkSj3Ag/exec';

export const sheetAPI = {
  // Lấy tất cả dữ liệu từ Sheets
  async getAllData() {
    try {
      const response = await fetch(`${SCRIPT_URL}?action=readAll`);
      return await response.json();
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
      return null;
    }
  },

  // Cập nhật lịch tập
  async updateSchedule(data: any) {
    return await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateSchedule', data })
    });
  },

  // Cập nhật quyền User (Chỉ Admin mới dùng)
  async updateUserRole(email: string, role: string, name: string = '', avatar: string = '') {
    return await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'updateUserRole', email, role, name, avatar })
    });
  },

  // Gửi đánh giá giáo viên
  async postRating(rating: any) {
    return await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'addRating', data: rating })
    });
  },

  // Gửi thông báo
  async sendNotification(msg: string, type: string) {
    return await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify({ action: 'addNotification', message: msg, type })
    });
  }
};