import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  toDo: string;
}

export default function App() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const [wishList, setWishList] = React.useState<string[]>(() => {
    const stored = localStorage.getItem("wishList");
    return stored ? JSON.parse(stored) : [];
  });

  const [visitedList, setVisitedList] = React.useState<string[]>(() => {
    const stored = localStorage.getItem("visitedList");
    return stored ? JSON.parse(stored) : [];
  });

  const [favoriteList, setFavoriteList] = React.useState<string[]>(() => {
    const stored = localStorage.getItem("favoriteList");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("wishList", JSON.stringify(wishList));
    localStorage.setItem("visitedList", JSON.stringify(visitedList));
    localStorage.setItem("favoriteList", JSON.stringify(favoriteList));
  }, [wishList, visitedList, favoriteList]);

  // 폼
  const addToWishList = (data: { toDo: string }) => {
    const { toDo } = data;
    if (toDo.trim() === "") return;
    setWishList((prev) => [...prev, toDo]);
    reset();
  };
  const removeFromList = (_list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setList((prev) => prev.filter((_, idx) => idx !== index));
  };

  // 리스트 변경
  const moveToList = (
    fromList: string[],
    setFromList: React.Dispatch<React.SetStateAction<string[]>>,
    _toList: string[],
    setToList: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    const itemToMove = fromList[index];
    setFromList((prev) => prev.filter((_, idx) => idx !== index));
    setToList((prev) => [...prev, itemToMove]);
  };

  // 가고싶은 나라들
  const onClickWishRemove = (index: number) => {
    return () => {
      removeFromList(wishList, setWishList, index);
    };
  };
  const onClickWishAdd = (index: number) => {
    return () => {
      moveToList(wishList, setWishList, visitedList, setVisitedList, index);
    };
  };

  // 내가 가본 나라들
  const onClickVisitedAdd = (index: number) => {
    return () => {
      moveToList(visitedList, setVisitedList, favoriteList, setFavoriteList, index);
    };
  };
  const onClicVisitedRemove = (index: number) => {
    return () => moveToList(visitedList, setVisitedList, wishList, setWishList, index);
  };

  // 내가 좋아하는 나라들
  const onClickFavoriteRemove = (index: number) => {
    return () => {
      moveToList(favoriteList, setFavoriteList, visitedList, setVisitedList, index);
    };
  };

  return (
    <>
      <section>
        <h2>내가 가고싶은 나라들</h2>
        <form onSubmit={handleSubmit(addToWishList)}>
          <input
            {...register("toDo", {
              required: "국가 이름을 입력하세요",
            })}
            type='text'
            placeholder='국가 이름'
          />
          {errors.toDo && <p>{errors.toDo.message}</p>}
          <button type='submit'>가자!</button>
        </form>

        <ul>
          {wishList.map((country, index) => (
            <li key={index}>
              {country}
              <button onClick={onClickWishAdd(index)}>✅</button>
              <button onClick={onClickWishRemove(index)}>🗑️</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>내가 가본 나라들</h2>
        <ul>
          {visitedList.map((country, index) => (
            <li key={index}>
              {country}
              <button onClick={onClickVisitedAdd(index)}>👍</button>
              <button onClick={onClicVisitedRemove(index)}>❌</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>내가 좋아하는 나라들</h2>
        <ul>
          {favoriteList.map((country, index) => (
            <li key={index}>
              {country}
              <button onClick={onClickFavoriteRemove(index)}>👎🏻</button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
