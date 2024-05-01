"use client";

import { Button } from "@/components/shared/button";
import { useRouter } from "next/navigation";

const NotFound: React.FC = () => {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="text-8xl sm:text-9xl font-extrabold tracking-widest">
        404
      </h1>
      <h2 className="font-semibold text-xl">
        Страница не найдена
      </h2>
      <Button variant="default" onClick={() => router.back()} className="mt-4">Назад</Button>
    </div>
  );
};

export default NotFound;
