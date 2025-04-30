// تنسيق الوقت بشكل صحيح
export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  // تنسيق التاريخ
  export const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-CA"); // تنسيق تاريخ "2025-04-22"
  };
  