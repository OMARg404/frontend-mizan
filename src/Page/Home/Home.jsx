import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getUser, updateBudget, addCredit } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import './Home.css';

const UpdateBudgetPage = () => {
    const { token } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newExpenses, setNewExpenses] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(null);
    const [updateError, setUpdateError] = useState(null);
    const [creditSuccess, setCreditSuccess] = useState(null);
    const [creditError, setCreditError] = useState(null);
    const [creditData, setCreditData] = useState({
        name: "",
        reason: "",
        allocation: ""
    });
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUser(token);
                if (response.msg === "success") {
                    setUser(response.user);
                } else {
                    setError("فشل في جلب بيانات المستخدم");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchUser();
        }
    }, [token]);

    const handleExpenseChange = (budgetId, value) => {
        setNewExpenses((prev) => ({
            ...prev,
            [budgetId]: value,
        }));
    };

    const handleUpdateBudget = async (budgetId) => {
        try {
            const expenses = newExpenses[budgetId] || 0;
            const response = await updateBudget(budgetId, expenses, token);
            
            if (response.msg === "success") {
                setUpdateSuccess(true);
                setUpdateError(null);
            } else {
                setUpdateError('فشل في تحديث الميزانية');
            }
        } catch (error) {
            setUpdateError(error.message);
            setUpdateSuccess(false);
        }
    };

    const handleCreditChange = (e) => {
        const { name, value } = e.target;
        setCreditData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddCredit = async (userId, budgetId ,nn) => {
        const creditDataToSend = {
            name: nn+`-`+creditData.name,
            reason: creditData.reason,
            allocation: parseFloat(creditData.allocation)
        };

        try {
            const response = await addCredit(userId, budgetId, creditDataToSend, token);
            
            if (response.msg === "success") {
                setCreditSuccess(true);
                setCreditError(null);
            } else {
                setCreditError('فشل في إضافة الطلب');
            }
        } catch (error) {
            setCreditError(error.message);
            setCreditSuccess(false);
        }
    };

    const toggleCard = (budgetId) => {
        setExpandedCard(expandedCard === budgetId ? null : budgetId);
    };

    if (loading) {
        return <div>جاري التحميل...</div>;
    }

    if (error) {
        return <div>خطأ: {error}</div>;
    }

    return (
        <div className="update-budget-page dd">
            {user && (
                <div className="user-info-container">
                    <h2>مرحبًا, {user.name} 😇</h2>
                    <p>البريد الإلكتروني: {user.email}</p>
                </div>
            )}
            <h3>ميزانياتك</h3>
            {user && user.budgets && user.budgets.length > 0 ? (
                <div className="budget-cards-scroll-container">
                    {user.budgets.map(budget => {
                        if (!budget.budgetId) return null;

                        const allocationPercentage = (budget.budgetId.expenses / budget.budgetId.allocation) * 100;
                        const remainingAmount = budget.budgetId.allocation - budget.budgetId.expenses;
                        const isExpanded = expandedCard === budget.budgetId._id;

                        return (
                            <div key={budget.budgetId._id} className="budget-card">
                                <h4 onClick={() => toggleCard(budget.budgetId._id)}>
                                    <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} /> {budget.budgetId.name}
                                </h4>
                                {isExpanded && (
                                    <>
                                        <p>{budget.budgetId.desc}</p>

                                        <div className="circle-container">
                                            <div className="circle-outer">
                                                <div
                                                    className="circle-inner"
                                                    style={{
                                                        background: `conic-gradient(#FF0000 ${allocationPercentage}%, #4CAF50 ${allocationPercentage}% 100%)`,
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="allocation-text">
                                                <p>الميزانية: {budget.budgetId.allocation}</p>
                                                <p>المتبقي: {remainingAmount}</p>
                                            </div>
                                        </div>

                                        <p>المصروفات: {budget.budgetId.expenses}</p>
                                        <p>الصلاحية: {budget.permission}</p>

                                        <div className="update-expenses">
                                            <input
                                                type="number"
                                                placeholder="إضافة مصروفات"
                                                value={newExpenses[budget.budgetId._id] || ''}
                                                onChange={(e) => handleExpenseChange(budget.budgetId._id, e.target.value)}
                                            />
                                            <button onClick={() => handleUpdateBudget(budget.budgetId._id)}>تحديث الميزانية</button>
                                        </div>

                                        <div className="add-credit">
                                            <h5>إضافة طلب</h5>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="عنوان الطلب او الخبر"
                                                value={creditData.name}
                                                onChange={handleCreditChange}
                                            />
                                            <input
                                                type="text"
                                                name="reason"
                                                placeholder="معلومات و سبب الطلب"
                                                value={creditData.reason}
                                                onChange={handleCreditChange}
                                            />
                                            <input
                                                type="number"
                                                name="allocation"
                                                placeholder="الميزانية"
                                                value={creditData.allocation}
                                                onChange={handleCreditChange}
                                            />
                                            <button onClick={() => handleAddCredit(user._id, budget.budgetId._id,budget.budgetId.name)}>إضافة طلب</button>
                                            {creditSuccess && <p className="success-message">تمت إضافة الطلب بنجاح!</p>}
                                            {creditError && <p className="error-message">خطأ في إضافة الطلب: {creditError}</p>}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p>لا توجد ميزانيات متاحة.</p>
            )}
        </div>
    );
};

export default UpdateBudgetPage;
