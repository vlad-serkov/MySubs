import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import SubsService from "../services/subs.service";

const BoardUser = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [content, setContent] = useState("");
    const [totalCost, setTotalCost] = useState(0);

    useEffect(() => {
        SubsService.getSubs("vladuss_1337@list.ru").then(
            (response) => {
                setSubscriptions(response);
                calculateTotalCost(response);
            },
            (error) => {
                console.error("Error getting subscriptions:", error);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );

        UserService.getUserBoard().then(
            (response) => {
                setContent(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setContent(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, []);

    const calculateTotalCost = (subs) => {
        const total = subs.reduce((acc, sub) => acc + sub.cost, 0);
        setTotalCost(total);
    };

    const handleDelete = (subId) => {
        SubsService.deleteSub(subId)
            .then(() => {
                SubsService.getSubs("vladuss_1337@list.ru").then((response) => {
                    setSubscriptions(response);
                    calculateTotalCost(response);
                });
            })
            .catch((error) => {
                console.error("Error deleting subscription:", error);
            });
    };

    return (
        <div className="container mt-4">
            <header className="jumbotron">
                <div className="mt-4">
                    <p className="mb-2">Полная сумма за год: {totalCost}</p>
                </div>
                <div className="mt-4">
                    <p className="mb-2">Полная сумма за месяц: {totalCost / 12}</p>
                </div>
                <h3 className="mb-4">Ваши подписки</h3>
                {subscriptions.reduce((acc, sub) => {
                    const existingSub = acc.find((groupedSub) => groupedSub.name === sub.name);

                    if (existingSub) {
                        if (sub.date) {
                            existingSub.dates.push(new Date(sub.date));
                        }
                    } else {
                        acc.push({
                            id: sub.id,
                            name: sub.name,
                            cost: sub.cost,
                            paymentMethods: sub.paymentMethods,
                            dates: sub.date ? [new Date(sub.date)] : [],
                        });
                    }

                    return acc;
                }, []).map((groupedSub, index) => (
                    <div key={index} className="mb-4">
                        <p className="mb-2">Название: {groupedSub.name}</p>
                        <p className="mb-2">Цена: {groupedSub.cost}</p>
                        <p className="mb-2">Метод оплаты: {groupedSub.paymentMethods}</p>
                        <p className="mb-2">
                            Dates: {`${new Date(Math.min(...groupedSub.dates)).toLocaleString()} - ${new Date(
                            Math.max(...groupedSub.dates)).toLocaleString()}`}
                        </p>
                        <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(groupedSub.id)}
                        >
                            Удалить
                        </button>
                    </div>
                ))}
            </header>
        </div>
    );
};

export default BoardUser;
