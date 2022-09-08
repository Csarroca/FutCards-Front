import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/store/hooks";
import {
  createCardActionCreator,
  deleteCardActionCreator,
  loadAllCardsActionCreator,
} from "../../features/cards/cardsSlice";
import { Card } from "../../features/cards/models/card";
import { toast } from "react-toastify";

export const successModal = (message: string) =>
  toast.success(message, {
    position: toast.POSITION.TOP_CENTER,
  });

export const errorModal = (error: string) =>
  toast.error(error, {
    position: toast.POSITION.TOP_CENTER,
  });

const url = process.env.REACT_APP_API_URL as string;

const useApi = () => {
  const cards = useAppSelector(({ cards }) => cards);
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.users);

  const getAllCards = useCallback(async () => {
    try {
      const { data }: AxiosResponse<Card[]> = await axios.get(`${url}/cards`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
      });
      dispatch<PayloadAction<Card[]>>(loadAllCardsActionCreator(data));
    } catch (error) {}
  }, [dispatch]);

  const deleteCard = useCallback(
    async (cardId: string) => {
      try {
        await axios.delete(`${url}/cards/${cardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(deleteCardActionCreator(cardId));
        successModal("Card deleted successfully!");
      } catch (error) {
        errorModal("Error deleting card");
      }
    },
    [dispatch, token]
  );

  const createCard = async (newCard: Card) => {
    try {
      await axios.post(`${url}/cards/create`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify(newCard),
      });

      dispatch(createCardActionCreator(newCard));

      successModal("Card created successfully!");
    } catch (error) {
      errorModal("Error creating card");
    }
  };

  return { cards, getAllCards, deleteCard, createCard };
};

export default useApi;
