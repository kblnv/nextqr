import React from "react";

interface DisplayCamAccessProps {
  hasAccess: boolean;
}

const DisplayCamAccess: React.FC<DisplayCamAccessProps> = ({ hasAccess }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      {hasAccess ? (
        <>
          <h1 className="text-center text-lg font-bold tracking-tight sm:text-2xl">
            Вы предоставили доступ к камере
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Чтобы начать сканирование включите камеру
          </p>
        </>
      ) : (
        <>
          <h1 className="text-center text-lg font-bold tracking-tight sm:text-2xl">
            Вы не предоставили доступ к камере
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            Чтобы продолжить предоставьте доступ к камере
          </p>
        </>
      )}
    </div>
  );
};

export { DisplayCamAccess };
