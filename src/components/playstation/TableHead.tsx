const TableHead = ({ isHistory }: { isHistory: boolean }) => {
  return (
    <thead className="bg-white">
      <tr className="*:p-5 *:rounded *:text-center">
        <td>رقم الجهاز</td>
        <td>الاسم</td>
        <td>وقت البداية</td>
        <td>وقت النهاية</td>
        <td>المشروبات & المأكولات</td>
        <td>السعر</td>
        {!isHistory && (
          <>
            <td>إيقاف</td>
            <td>إجراء</td>
          </>
        )}
      </tr>
    </thead>
  );
};

export default TableHead;
