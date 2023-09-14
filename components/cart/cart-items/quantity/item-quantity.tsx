import { Cart, LineItem } from '@commercetools/platform-sdk';
import { App, Button, Input, Spin } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import updateCart from '@/pages/api/update-cart';

interface Props {
  item: LineItem;
  cart: Cart;
  setCart: Dispatch<SetStateAction<Cart | null>>;
}

const minQuantity = 1;

const ItemQuantity = ({ item, cart, setCart }: Props) => {
  const { notification } = App.useApp();

  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [loading, setLoading] = useState<boolean>(true);

  const maxQuantity = item.variant.availability?.availableQuantity ?? 1;

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(false);
      try {
        const response = await updateCart(cart.id, cart.version, [
          { action: 'changeLineItemQuantity', lineItemId: item.id, quantity },
        ]);
        if (response && 'type' in response) {
          setCart(response as Cart);
        } else {
          setCart(null);
        }
        setLoading(true);
      } catch (error) {
        console.error(error);
      }
    };

    if (quantity !== item.quantity) {
      fetchCart();
    }
  }, [quantity]);

  const handleQuantityChange = debounce(async (newValue: number) => {
    if (newValue >= minQuantity && newValue <= maxQuantity) {
      setQuantity(newValue);
    } else if (newValue > maxQuantity) {
      setQuantity(maxQuantity);
      notification.info({
        message: `Sorry, we have only ${maxQuantity} ${item.name.en} available at the moment.`,
        description: 'Please contact us if you need more items.',
        placement: 'bottom',
      });
    } else {
      setQuantity(minQuantity);
    }
  }, 200);

  return (
    <>
      <Button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity === minQuantity}>
        <MinusOutlined />
      </Button>
      <Input
        value={quantity}
        style={{ width: 70, margin: '0 5px', textAlign: 'center' }}
        maxLength={4}
        onChange={(e) => {
          const newValue = parseInt(e.target.value, 10);
          handleQuantityChange(newValue);
        }}
      ></Input>
      <Button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= maxQuantity}>
        <PlusOutlined />
      </Button>
      {loading || <Spin style={{ marginLeft: 5 }} />}
    </>
  );
};

export default ItemQuantity;