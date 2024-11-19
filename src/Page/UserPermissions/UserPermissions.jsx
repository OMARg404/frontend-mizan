import React, { useState, useEffect, useContext } from 'react';
import { getUsers } from '../../services/api.js';  // استيراد وظيفة API
import { Spinner, Table } from 'react-bootstrap'; // لعرض رمز تحميل وجدول
import { AuthContext } from '../../context/AuthContext.js'; // استيراد AuthContext
import './UserPermissions.css';

const UserPermissions = () => {
  const [users, setUsers] = useState([]); // حالة المستخدمين
  const [loading, setLoading] = useState(true); // حالة التحميل
  const { token } = useContext(AuthContext); // الحصول على الرمز من AuthContext

  // جلب بيانات المستخدمين عند تحميل المكون
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // جلب المستخدمين من API
        const userData = await getUsers(token);
        console.log('Fetched users:', userData); // تسجيل الاستجابة للتحقق من هيكلها

        if (Array.isArray(userData.users)) {
          setUsers(userData.users); // تعيين المستخدمين إذا كانوا في شكل مصفوفة
        } else {
          setUsers([]); // تعيين مصفوفة فارغة إذا لم تكن البيانات في شكل مصفوفة
        }
      } catch (error) {
        console.error('Error fetching data:', error); // تسجيل الخطأ إذا فشل الجلب
        setUsers([]); // تعيين مصفوفة فارغة للمستخدمين عند حدوث خطأ
      } finally {
        setLoading(false); // تعيين التحميل إلى false بعد اكتمال الجلب
      }
    };

    fetchUsers();
  }, [token]); // اعتماد على الرمز لإعادة الجلب إذا تغير

  // Function to get the name and permission of each budget
  const getBudgetDetails = (budgets) => {
    if (!budgets || budgets.length === 0) {
      return 'لا توجد ميزانيات';
    }

    return budgets.map(budget => {
      const budgetName = budget.budgetId && budget.budgetId.name ? budget.budgetId.name : 'غير معروف';
      const permission = budget.permission || 'لا يوجد صلاحيات';
      return `${budgetName} - ${permission}`;
    }).join(', ');
  };

  return (
    <div className="user-permissions-container cccccc">
      <h2>صفحة صلاحيات المستخدمين</h2>
      {loading ? (
        // عرض رمز تحميل أثناء جلب البيانات
        <Spinner animation="border" role="status">
          <span className="visually-hidden">جاري التحميل...</span>
        </Spinner>
      ) : (
        // عرض المستخدمين في جدول عند تحميل البيانات
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>البريد الإلكتروني</th>
              <th>الدور</th>
              <th>المزانيات الخاصة به</th> {/* عمود الميزانيات */}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              // عرض قائمة المستخدمين في صفوف الجدول
              users.map((user) => (
                <tr key={user._id}> {/* استخدام user._id كمعرف فريد */}
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{getBudgetDetails(user.budgets)}</td> {/* عرض أسماء الميزانيات والصلاحيات */}
                </tr>
              ))
            ) : (
              // عرض رسالة إذا لم يتم العثور على مستخدمين
              <tr>
                <td colSpan="4">لم يتم العثور على مستخدمين.</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserPermissions;
