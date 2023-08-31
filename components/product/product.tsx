import { useState, useEffect, useRef } from 'react';
import { Spin, Row, Col } from 'antd';
import { ProductProjection, Image } from '@commercetools/platform-sdk';

import Slider from './slider';
import ProductBreadcrumb from './breadcrumb';
import ProductDetails from './details';
import Attributes from './attributes';
import ImageModal from './modal';

enum AttributesKeys {
  BRAND = 'brand',
  AGE_RANGE = 'age-range',
  GENDER = 'gender',
  MATERIAL = 'material',
}

const Product = ({ product }: { product: ProductProjection }) => {
  const [images, setImages] = useState<Image[]>([]);
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const carouselRef = useRef<any>(null);
  const modalCarouselRef = useRef<any>(null);

  useEffect(() => {
    if (product) {
      setImages(product.masterVariant.images || []);
    }
  }, [product]);

  useEffect(() => {
    if (open && modalCarouselRef.current) {
      modalCarouselRef.current.goTo(currentImage);
    }
  }, [open, currentImage]);

  const handleImageClick = (index: number) => {
    setCurrentImage(index);
    setOpen(true);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImage(index);
    carouselRef.current.goTo(index);
  };

  const handleCancel = () => {
    setOpen(false);
    setTimeout(() => {
      if (modalCarouselRef.current) {
        modalCarouselRef.current.goTo(currentImage);
      }
    }, 0);
  };

  const next = () => {
    if (modalCarouselRef.current) {
      modalCarouselRef.current.next();
    }
  };

  const prev = () => {
    if (modalCarouselRef.current) {
      modalCarouselRef.current.prev();
    }
  };

  if (!product) {
    return <Spin />;
  }

  const { name } = product;
  const metaDescription = product.metaDescription ? product.metaDescription.en : '';
  const { masterVariant } = product;
  const { attributes } = masterVariant;

  let brand = '';
  let ageRange = '';
  let gender = '';
  let material = '';

  if (attributes) {
    const brandObj = attributes.find((attr) => attr.name === AttributesKeys.BRAND);

    if (brandObj) {
      brand = brandObj.value.label;
    }

    const ageRangeObj = attributes.find((attr) => attr.name === AttributesKeys.AGE_RANGE);

    if (ageRangeObj) {
      ageRange = ageRangeObj.value.label;
    }

    const genderObj = attributes.find((attr) => attr.name === AttributesKeys.GENDER);

    if (genderObj) {
      gender = genderObj.value.label;
    }

    const materialObj = attributes.find((attr) => attr.name === AttributesKeys.MATERIAL);
    if (materialObj) {
      material = materialObj.value.label;
    }
  }

  let regularPrice = 0;
  let discountedPrice = 0;

  if (masterVariant.prices) {
    regularPrice = masterVariant.prices[0].value.centAmount;

    if (masterVariant.prices[0].discounted) {
      discountedPrice = masterVariant.prices[0].discounted.value.centAmount;
    }
  }

  return (
    <div
      style={{
        paddingBlock: '32px',
        paddingInline: '32px',
        marginInline: 'auto',
        minHeight: '82vh',
        maxWidth: '1600px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}
    >
      <Row gutter={32}>
        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
          <Slider
            images={images}
            handleImageClick={handleImageClick}
            handleThumbnailClick={handleThumbnailClick}
            carouselRef={carouselRef}
            name={name}
          ></Slider>
        </Col>
        <Col xs={24} sm={24} md={24} lg={14} xl={14}>
          <div>
            <ProductBreadcrumb name={name.en}></ProductBreadcrumb>
            <ProductDetails
              name={name.en}
              brand={brand}
              regularPrice={regularPrice}
              discountedPrice={discountedPrice}
            ></ProductDetails>
            <Attributes
              description={metaDescription}
              ageRange={ageRange}
              gender={gender}
              material={material}
            ></Attributes>
          </div>
        </Col>
      </Row>
      <ImageModal
        open={open}
        handleCancel={handleCancel}
        images={images}
        currentImage={currentImage}
        next={next}
        prev={prev}
        name={name}
        brand={brand}
        modalCarouselRef={modalCarouselRef}
      ></ImageModal>
    </div>
  );
};

export default Product;
