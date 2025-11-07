export function Titlebar() {
  return (
    <div className="titlebar">
      <div className="icon-title-region">
        <img className="h-5" src="/images/logo.png" alt="Logo" />
        <h1 className="w-full text-sm font-bold">
          {" "}
          Decked <span className="text-primary">Out</span>
        </h1>
      </div>
    </div>
  );
}
