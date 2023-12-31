import { LineItem } from '@commercetools/platform-sdk';
import { getCurrency, getPrice } from '../helpers/get-price';

interface Props {
  isPromoExists: boolean;
  item: LineItem;
}

const ItemPrice = ({ item }: Props) => {
  return item.price.discounted ? (
    <>
      <s>
        {getCurrency(item.price.value)}
        {getPrice(item.price.value)}
      </s>
      <b style={{ fontSize: 16, marginLeft: 5, color: 'red' }}>
        {getCurrency(item.price.discounted.value)}
        {getPrice(item.price.discounted.value)}
      </b>
    </>
  ) : (
    <b style={{ fontSize: 16 }}>
      {getCurrency(item.price.value)}
      {getPrice(item.price.value)}
    </b>
  );
};

export default ItemPrice;
