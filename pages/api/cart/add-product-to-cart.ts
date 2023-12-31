import { ClientResponse } from '@commercetools/sdk-client-v2';
import { ErrorResponse } from '@commercetools/platform-sdk';
import Client from '../client';

async function addProductToActiveCart(cartId: string, cartVersion: number, productId: string) {
  const client = Client.getInstance().anonymousClient;

  try {
    const response = await client
      .me()
      .carts()
      .withId({ ID: cartId })
      .post({
        body: {
          version: cartVersion,
          actions: [{ action: 'addLineItem', productId }],
        },
      })
      .execute();

    return response.body;
  } catch (error) {
    const errorResponse = JSON.parse(JSON.stringify(error)) as ClientResponse<ErrorResponse>;
    if (errorResponse.statusCode === 403) {
      window.location.reload();
    }
    return errorResponse.body;
  }
}

export default addProductToActiveCart;
