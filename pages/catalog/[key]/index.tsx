import { GetServerSideProps } from 'next';
import { ProductProjection } from '@commercetools/platform-sdk';
import { App } from 'antd';
import Product from '@/components/product/product';
import getProductbyKey from '../../api/get-product';

interface ProductPageProps {
  product: ProductProjection;
}

const ProductPage = ({ product }: ProductPageProps): JSX.Element => {
  return (
    <App>
      <Product product={product} />
    </App>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { key } = context.query;

  if (typeof key !== 'string') {
    return {
      notFound: true,
    };
  }

  const productData = await getProductbyKey(key);

  if (!productData) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: productData,
    },
  };
};

export default ProductPage;
