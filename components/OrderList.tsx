"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface OrderListProps {
  orders: Array<any>;
}

export default function OrderList({ orders = [] }: OrderListProps) {
  const [internalOrders, setInternalOrders] = useState(orders);
  const supabase = createClient();

  useEffect(() => {
    // Realtime subscriptions
    // Database changes
    // Listen to changes in the Database inserts, updates, and deletes and other changes.
    const subscriber = supabase
      .channel("order")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
        },
        (payload: any) => {
          setInternalOrders((prevOrders) => [...prevOrders, payload.new]);
        }
      )
      .subscribe();

    // Note:
    // -- "react-supabase" is a React Hooks library for Supabase which has the following custom hooks to subscrite to database changes in realtime, fetch table and listen for changes: --
    // https://react-supabase.vercel.app/documentation/realtime/use-subscription
    // https://react-supabase.vercel.app/documentation/realtime/use-realtime

    // Actividad: Implementar la logica para aplicar los cambios en el arreglo de orders
    // con los datos provenientes de la base de datos (hint: Update).

    return () => {
      subscriber.unsubscribe();
    };
  }, [supabase]);

  return (
    <table>
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Subtotal</th>
          <th>Discount</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {internalOrders?.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.subtotal}</td>
            <td>{order.discount}</td>
            <td>{order.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
