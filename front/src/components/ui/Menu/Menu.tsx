import { useState } from "react";
import { Link } from "react-router"

const Menu = () => {

    const [open, setOpen] = useState(false);

    return (
        <div>
            <img
            src="images/menu.svg"
            width={28}
            height={28}
            alt="Меню"
            className="cursor-pointer"
            onClick={()=>setOpen(prev=>!prev)}
            />
            {
            open && (
                <div className="absolute bg-[pink] top-20 left-0 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10 text-white">
                <Link href="/">Вход</Link>
                <Link href="/">Каталог</Link>
                <Link href="/">Доставка</Link>
                <Link href="/">Избранное</Link>
                <Link href="/">Корзина</Link>
                <Link href="/">О нас</Link>
                </div>
            )
            }
        </div>
    )
}

export default Menu