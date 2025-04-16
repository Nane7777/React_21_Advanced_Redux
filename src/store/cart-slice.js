import {createSlice} from "@reduxjs/toolkit";
import {uiActions} from "./ui-slice";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalQuantity: 0,
    },
    reducers: {
        addItemToCart(state, action) {
            const newItem = action.payload;
            const existingItems = state.items.find(item => item.id === newItem.id);
            state.totalQuantity++;
            if (!existingItems) {
                state.items.push({
                    id: newItem.id,
                    price: newItem.price,
                    quantity: 1,
                    totalPrice: newItem.price,
                    name: newItem.title,
                });
            } else {
                existingItems.quantity++;
                existingItems.totalPrice = existingItems.totalPrice + newItem.price;
            }
        },
        removeItemFromCart(state, action) {
            const id = action.payload;
            const existingItems = state.items.find(item => item.id === id);
            state.totalQuantity--;
            if (existingItems.quantity === 1) {
                state.items = state.items.filter(item => item.id !== id);
            } else {
                existingItems.quantity--;
            }
        },
    }
});

const sendCartData = (cart) => {
    return async (dispatch) => {
        dispatch(
            uiActions.showNotification({
                status: 'pending',
                title: 'Sending...',
                message: 'Sending cart data!'
            })
        );

        const sendRequest = async () => {
            const response = await fetch(
                'https://react21-53d32-default-rtdb.europe-west1.firebasedatabase.app/cart.json',
                {
                    method: 'PUT',
                    body: JSON.stringify(cart),
                }
            );

            if (!response.ok) {
                throw new Error('Sending cart data failed.');
            }
        }

        try {
        await sendRequest();

        dispatch(
            uiActions.showNotification({
                status: 'success',
                title: 'Success!',
                message: 'Sending cart data successfully!'
            })
        );
        } catch (error) {
            dispatch(
                uiActions.showNotification({
                    status: 'error',
                    title: 'Error!',
                    message: 'Sending cart data failed!'
                })
            );
        }
    };
};

export const cartActions = cartSlice.actions;

export default cartSlice;