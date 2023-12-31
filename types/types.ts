import { Attribute, LocalizedString, Image, Price } from '@commercetools/platform-sdk';

export interface Discount {
  permyriad: number;
  type: string;
}
export interface Product {
  key: string;
  id: string;
  description: LocalizedString | undefined;
  descriptionPreview: string | undefined;
  attributes: Attribute[] | undefined;
  images: Image[] | undefined;
  prices: Price[] | undefined;
  name: LocalizedString;
  discount: number | undefined;
}
