import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";

interface FormData {
  toDo: string;
}

const ListBox = styled.section`
  max-width: 480px;
  margin: 40px auto;

  &:nth-child(1) {
    padding-top: 40px;
  }
`;

const Title = styled.h2`
  padding: 12px 0;
  font-size: 18px;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;

  small {
    padding: 4px 0 8px;
    font-size: 12px;
    color: red;
  }
`;

const List = styled.ul`
  margin: 8px 0;
`;

const Item = styled.li`
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 8px 0;

  button {
    margin: 0;
    padding: 12px;
  }
`;

export default function Home() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // 가고싶은나라
  const [wishList, setWishList] = React.useState<string[]>(() => {
    const stored = localStorage.getItem("wishList");
    return stored ? JSON.parse(stored) : [];
  });

  // 가본나라
  const [visitedList, setVisitedList] = React.useState<string[]>(() => {
    const stored = localStorage.getItem("visitedList");
    return stored ? JSON.parse(stored) : [];
  });

  // 좋아하는나라
  const [favoriteList, setFavoriteList] = React.useState<string[]>(() => {
    const stored = localStorage.getItem("favoriteList");
    return stored ? JSON.parse(stored) : [];
  });

  // localStorage 관리 함수
  const updateLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  useEffect(() => {
    updateLocalStorage("wishList", wishList);
    updateLocalStorage("visitedList", visitedList);
    updateLocalStorage("favoriteList", favoriteList);
  }, [wishList, visitedList, favoriteList]);

  // 폼 입력
  const addToWishList = (data: { toDo: string }) => {
    const { toDo } = data;
    if (toDo.trim() === "") return;
    setWishList((prev) => [...prev, toDo]);
    reset();
  };

  // 리스트 관리 함수
  const manipulateList = (
    fromList: string[],
    setFromList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    operation: "remove" | "move",
    setToList: React.Dispatch<React.SetStateAction<string[]>> = () => {}
  ) => {
    const itemToMove = fromList[index];
    setFromList((prev) => prev.filter((_, idx) => idx !== index));
    if (operation === "move") {
      setToList((prev) => [...prev, itemToMove]);
    }
  };

  // click 이벤트
  const onClickWishRemove = (index: number) => () => {
    manipulateList(wishList, setWishList, index, "remove");
  };
  const onClickWishAdd = (index: number) => () => {
    manipulateList(wishList, setWishList, index, "move", setVisitedList);
  };
  const onClickVisitedAdd = (index: number) => () => {
    manipulateList(visitedList, setVisitedList, index, "move", setFavoriteList);
  };
  const onClicVisitedRemove = (index: number) => () => {
    manipulateList(visitedList, setVisitedList, index, "move", setWishList);
  };
  const onClickFavoriteRemove = (index: number) => () => {
    manipulateList(favoriteList, setFavoriteList, index, "move", setVisitedList);
  };

  return (
    <>
      <ListBox>
        <Title>내가 가고싶은 나라들</Title>
        <Form onSubmit={handleSubmit(addToWishList)}>
          <input
            {...register("toDo", {
              required: "나라를 입력하세요 😥",
            })}
            type='text'
            placeholder='이름'
          />
          {errors.toDo && <small>{errors.toDo.message}</small>}
          <button type='submit'>가자!</button>
        </Form>

        <List>
          {wishList.map((country, index) => (
            <Item key={index}>
              <p>{country}</p>
              <button onClick={onClickWishAdd(index)}>✅</button>
              <button onClick={onClickWishRemove(index)}>🗑️</button>
            </Item>
          ))}
        </List>
      </ListBox>

      <ListBox>
        <Title>내가 가본 나라들</Title>
        <List>
          {visitedList.map((country, index) => (
            <Item key={index}>
              <p>{country}</p>
              <button onClick={onClickVisitedAdd(index)}>👍</button>
              <button onClick={onClicVisitedRemove(index)}>❌</button>
            </Item>
          ))}
        </List>
      </ListBox>

      <ListBox>
        <Title>내가 좋아하는 나라들</Title>
        <List>
          {favoriteList.map((country, index) => (
            <Item key={index}>
              <p>{country}</p>
              <button onClick={onClickFavoriteRemove(index)}>👎🏻</button>
            </Item>
          ))}
        </List>
      </ListBox>
    </>
  );
}
