import { Link } from "react-router"
import Game from "../../ui/game/Game"

const NotFound = () => {
    return (
    <div className="px-4 md:px-8 lg:px-10 xl:px-[100px]">
        <div className="pt-[30px] flex justify-between items-center flex-col">
            <h2 className="text-[64px]">404</h2>
            <div className="flex flex-col ">
                <span className="text-[20px]">СТРАНИЦА НЕ НАЙДЕНА</span>
                <Link className="text-center text-secondary b-point" href='/'>На главную</Link>
            </div>
        </div>
        <Game />
    </div>
    )
}

export default NotFound