import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import OrderService, { Order } from '../../../services/OrderService';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      OrderService.getOrderById(orderId)
        .then(({ data }) => setOrder(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] py-6">
        <p>Загрузка информации о заказе...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] py-6">
        <h1 className="text-2xl font-semibold mb-4">Заказ не найден</h1>
        <Link to="/" className="text-secondary hover:underline">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-10 xl:px-[100px] py-6">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <svg
            className="w-16 h-16 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h1 className="text-3xl font-semibold mb-2">Заказ успешно оформлен!</h1>
          <p className="text-gray-600">
            Номер вашего заказа: <span className="font-medium">{order.id}</span>
          </p>
        </div>

        <div className="mb-8 text-left">
          <h2 className="text-xl font-semibold mb-4">Детали заказа:</h2>
          <div className="space-y-4">
            <p>
              <span className="font-medium">Email: </span>
              {order.email}
            </p>
            <p>
              <span className="font-medium">Статус: </span>
              {order.status === 'PENDING' ? 'Ожидает оплаты' : order.status}
            </p>
            <p>
              <span className="font-medium">Сумма заказа: </span>
              {order.total}₽
            </p>
          </div>
        </div>

        <Link
          to="/"
          className="inline-block bg-secondary text-white px-6 py-3 rounded-md hover:bg-secondary-dark transition-colors"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 