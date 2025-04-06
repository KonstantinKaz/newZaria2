import React, { useEffect, useRef, useState } from 'react';
import styles from './Game.module.css';

const Game: React.FC = () => {
  const mazeRef = useRef<HTMLDivElement>(null);
  const joystickHeadRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const [noteContent, setNoteContent] = useState<string | null>(null);

  useEffect(() => {
    // Математические функции
    const MathMinMax = (value: number, limit: number) => {
      return Math.max(Math.min(value, limit), -limit);
    };

    const distance2D = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    };

    const getAngle = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
      return angle;
    };

    const closestItCanBe = (cap: { x: number; y: number }, ball: { x: number; y: number }) => {
      const angle = getAngle(cap, ball);

      const deltaX = Math.cos(angle) * (wallW / 2 + ballSize / 2);
      const deltaY = Math.sin(angle) * (wallW / 2 + ballSize / 2);

      return { x: cap.x + deltaX, y: cap.y + deltaY };
    };

    const rollAroundCap = (
      cap: { x: number; y: number },
      ball: { x: number; y: number; velocityX: number; velocityY: number }
    ) => {
      let impactAngle = getAngle(ball, cap);

      let heading = getAngle({ x: 0, y: 0 }, { x: ball.velocityX, y: ball.velocityY });

      let impactHeadingAngle = impactAngle - heading;

      const velocityMagnitude = distance2D({ x: 0, y: 0 }, { x: ball.velocityX, y: ball.velocityY });
      const velocityMagnitudeDiagonalToTheImpact =
        Math.sin(impactHeadingAngle) * velocityMagnitude;

      const closestDistance = wallW / 2 + ballSize / 2;

      const rotationAngle = Math.atan2(
        velocityMagnitudeDiagonalToTheImpact,
        closestDistance
      );

      const deltaFromCap = {
        x: Math.cos(impactAngle + Math.PI - rotationAngle) * closestDistance,
        y: Math.sin(impactAngle + Math.PI - rotationAngle) * closestDistance,
      };

      const x = ball.x;
      const y = ball.y;
      const velocityX = ball.x - (cap.x + deltaFromCap.x);
      const velocityY = ball.y - (cap.y + deltaFromCap.y);
      const nextX = x + velocityX;
      const nextY = y + velocityY;

      return { x, y, velocityX, velocityY, nextX, nextY };
    };

    const slow = (number: number, difference: number) => {
      if (Math.abs(number) <= difference) return 0;
      if (number > difference) return number - difference;
      return number + difference;
    };

    // Инициализация переменных
    let previousTimestamp: number | undefined;
    let gameInProgress = false;
    let mouseStartX: number | undefined;
    let mouseStartY: number | undefined;
    let accelerationX = 0;
    let accelerationY = 0;
    let frictionX = 0;
    let frictionY = 0;

    const pathW = 25; // Ширина пути
    const wallW = 10; // Ширина стены
    const ballSize = 10; // Размер шарика
    const holeSize = 18;

    const debugMode = false;

    let balls: any[] = [];
    let ballElements: HTMLDivElement[] = [];
    let holeElements: HTMLDivElement[] = [];

    // Определение стен
    const walls = [
      // Границы
      { column: 0, row: 0, horizontal: true, length: 10 },
      { column: 0, row: 0, horizontal: false, length: 9 },
      { column: 0, row: 9, horizontal: true, length: 10 },
      { column: 10, row: 0, horizontal: false, length: 9 },

      // Горизонтальные линии, начинающиеся в 1-й колонке
      { column: 0, row: 6, horizontal: true, length: 1 },
      { column: 0, row: 8, horizontal: true, length: 1 },

      // Горизонтальные линии, начинающиеся во 2-й колонке
      { column: 1, row: 1, horizontal: true, length: 2 },
      { column: 1, row: 7, horizontal: true, length: 1 },

      // Горизонтальные линии, начинающиеся в 3-й колонке
      { column: 2, row: 2, horizontal: true, length: 2 },
      { column: 2, row: 4, horizontal: true, length: 1 },
      { column: 2, row: 5, horizontal: true, length: 1 },
      { column: 2, row: 6, horizontal: true, length: 1 },

      // Горизонтальные линии, начинающиеся в 4-й колонке
      { column: 3, row: 3, horizontal: true, length: 1 },
      { column: 3, row: 8, horizontal: true, length: 3 },

      // Горизонтальные линии, начинающиеся в 5-й колонке
      { column: 4, row: 6, horizontal: true, length: 1 },

      // Горизонтальные линии, начинающиеся в 6-й колонке
      { column: 5, row: 2, horizontal: true, length: 2 },
      { column: 5, row: 7, horizontal: true, length: 1 },

      // Горизонтальные линии, начинающиеся в 7-й колонке
      { column: 6, row: 1, horizontal: true, length: 1 },
      { column: 6, row: 6, horizontal: true, length: 2 },

      // Горизонтальные линии, начинающиеся в 8-й колонке
      { column: 7, row: 3, horizontal: true, length: 2 },
      { column: 7, row: 7, horizontal: true, length: 2 },

      // Горизонтальные линии, начинающиеся в 9-й колонке
      { column: 8, row: 1, horizontal: true, length: 1 },
      { column: 8, row: 2, horizontal: true, length: 1 },
      { column: 8, row: 3, horizontal: true, length: 1 },
      { column: 8, row: 4, horizontal: true, length: 2 },
      { column: 8, row: 8, horizontal: true, length: 2 },

      // Вертикальные линии после 1-й колонки
      { column: 1, row: 1, horizontal: false, length: 2 },
      { column: 1, row: 4, horizontal: false, length: 2 },

      // Вертикальные линии после 2-й колонки
      { column: 2, row: 2, horizontal: false, length: 2 },
      { column: 2, row: 5, horizontal: false, length: 1 },
      { column: 2, row: 7, horizontal: false, length: 2 },

      // Вертикальные линии после 3-й колонки
      { column: 3, row: 0, horizontal: false, length: 1 },
      { column: 3, row: 4, horizontal: false, length: 1 },
      { column: 3, row: 6, horizontal: false, length: 2 },

      // Вертикальные линии после 4-й колонки
      { column: 4, row: 1, horizontal: false, length: 2 },
      { column: 4, row: 6, horizontal: false, length: 1 },

      // Вертикальные линии после 5-й колонки
      { column: 5, row: 0, horizontal: false, length: 2 },
      { column: 5, row: 6, horizontal: false, length: 1 },
      { column: 5, row: 8, horizontal: false, length: 1 },

      // Вертикальные линии после 6-й колонки
      { column: 6, row: 4, horizontal: false, length: 1 },
      { column: 6, row: 6, horizontal: false, length: 1 },

      // Вертикальные линии после 7-й колонки
      { column: 7, row: 1, horizontal: false, length: 4 },
      { column: 7, row: 7, horizontal: false, length: 2 },

      // Вертикальные линии после 8-й колонки
      { column: 8, row: 2, horizontal: false, length: 1 },
      { column: 8, row: 4, horizontal: false, length: 2 },

      // Вертикальные линии после 9-й колонки
      { column: 9, row: 1, horizontal: false, length: 1 },
      { column: 9, row: 5, horizontal: false, length: 2 },
    ].map((wall) => ({
      x: wall.column * (pathW + wallW),
      y: wall.row * (pathW + wallW),
      horizontal: wall.horizontal,
      length: wall.length * (pathW + wallW),
    }));


    // Создание стен
    walls.forEach(({ x, y, horizontal, length }) => {
      const wall = document.createElement('div');
      wall.setAttribute('class', styles.wall);
      wall.style.left = `${x}px`;
      wall.style.top = `${y}px`;
      wall.style.width = `${wallW}px`;
      wall.style.height = `${length}px`;
      wall.style.transform = `rotate(${horizontal ? -90 : 0}deg)`;

      mazeRef.current?.appendChild(wall);
    });

    // Функция сброса игры
    const resetGame = () => {
      previousTimestamp = undefined;
      gameInProgress = false;
      mouseStartX = undefined;
      mouseStartY = undefined;
      accelerationX = 0;
      accelerationY = 0;
      frictionX = 0;
      frictionY = 0;

      if (mazeRef.current) {
        mazeRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
      }

      if (joystickHeadRef.current) {
        joystickHeadRef.current.style.left = '0';
        joystickHeadRef.current.style.top = '0';
        joystickHeadRef.current.style.animation = '';
        joystickHeadRef.current.style.cursor = 'grab';
      }

      balls = [
        { column: 0, row: 0 },
        { column: 9, row: 0 },
        { column: 0, row: 8 },
        { column: 9, row: 8 },
      ].map((ball) => ({
        x: ball.column * (wallW + pathW) + (wallW / 2 + pathW / 2),
        y: ball.row * (wallW + pathW) + (wallW / 2 + pathW / 2),
        velocityX: 0,
        velocityY: 0,
      }));

      // Удаление предыдущих элементов шариков
      ballElements.forEach((ballElement) => {
        mazeRef.current?.removeChild(ballElement);
      });
      ballElements = [];

      // Создание новых элементов шариков
      balls.forEach(({ x, y }) => {
        const ball = document.createElement('div');
        ball.setAttribute('class', styles.ball);
        ball.style.left = `${x}px`;
        ball.style.top = `${y}px`;

        mazeRef.current?.appendChild(ball);
        ballElements.push(ball);
      });

      // Удаление предыдущих элементов дыр
      holeElements.forEach((holeElement) => {
        mazeRef.current?.removeChild(holeElement);
      });
      holeElements = [];

      setNoteContent(null);

    };

    // Обработчики событий
    const handleJoystickMouseDown = (event: MouseEvent) => {
      if (!gameInProgress) {
        mouseStartX = event.clientX;
        mouseStartY = event.clientY;
        gameInProgress = true;
        window.requestAnimationFrame(main);
        if (noteRef.current) {
          noteRef.current.style.opacity = '0';
        }
        if (joystickHeadRef.current) {
          joystickHeadRef.current.style.animation = 'none';
          joystickHeadRef.current.style.cursor = 'grabbing';
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (gameInProgress) {
        const mouseDeltaX = -MathMinMax((mouseStartX || 0) - event.clientX, 15);
        const mouseDeltaY = -MathMinMax((mouseStartY || 0) - event.clientY, 15);

        if (joystickHeadRef.current) {
          joystickHeadRef.current.style.left = `${mouseDeltaX}px`;
          joystickHeadRef.current.style.top = `${mouseDeltaY}px`;
          joystickHeadRef.current.style.animation = 'none';
          joystickHeadRef.current.style.cursor = 'grabbing';
        }

        const rotationY = mouseDeltaX; // Max rotation = 12
        const rotationX = mouseDeltaY;

        if (mazeRef.current) {
          mazeRef.current.style.transform = `rotateY(${rotationY}deg) rotateX(${-rotationX}deg)`;
        }

        const gravity = 2;
        const friction = 0.01; // Коэффициент трения

        accelerationX = gravity * Math.sin((rotationY / 180) * Math.PI);
        accelerationY = gravity * Math.sin((rotationX / 180) * Math.PI);
        frictionX = gravity * Math.cos((rotationY / 180) * Math.PI) * friction;
        frictionY = gravity * Math.cos((rotationX / 180) * Math.PI) * friction;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (![' ', 'H', 'h', 'E', 'e'].includes(event.key)) return;

      event.preventDefault();

      if (event.key === ' ') {
        resetGame();
        return;
      }

      if (event.key === 'E' || event.key === 'e') {
        resetGame();
        return;
      }
    };

    // Основной цикл игры
    const main = (timestamp: number) => {
      if (!gameInProgress) return;

      if (previousTimestamp === undefined) {
        previousTimestamp = timestamp;
        window.requestAnimationFrame(main);
        return;
      }

      const maxVelocity = 1.5;

      const timeElapsed = (timestamp - previousTimestamp) / 16;

      try {
        if (accelerationX !== undefined && accelerationY !== undefined) {
          const velocityChangeX = accelerationX * timeElapsed;
          const velocityChangeY = accelerationY * timeElapsed;
          const frictionDeltaX = frictionX * timeElapsed;
          const frictionDeltaY = frictionY * timeElapsed;

          balls.forEach((ball) => {
            if (velocityChangeX === 0) {
              ball.velocityX = slow(ball.velocityX, frictionDeltaX);
            } else {
              ball.velocityX = ball.velocityX + velocityChangeX;
              ball.velocityX = Math.max(Math.min(ball.velocityX, 1.5), -1.5);
              ball.velocityX = ball.velocityX - Math.sign(velocityChangeX) * frictionDeltaX;
              ball.velocityX = MathMinMax(ball.velocityX, maxVelocity);
            }

            if (velocityChangeY === 0) {
              ball.velocityY = slow(ball.velocityY, frictionDeltaY);
            } else {
              ball.velocityY = ball.velocityY + velocityChangeY;
              ball.velocityY = ball.velocityY - Math.sign(velocityChangeY) * frictionDeltaY;
              ball.velocityY = MathMinMax(ball.velocityY, maxVelocity);
            }

            ball.nextX = ball.x + ball.velocityX;
            ball.nextY = ball.y + ball.velocityY;

            // Логика столкновений со стенами
            walls.forEach((wall) => {
              if (wall.horizontal) {
                // Горизонтальная стена
                if (
                  ball.nextY + ballSize / 2 >= wall.y - wallW / 2 &&
                  ball.nextY - ballSize / 2 <= wall.y + wallW / 2
                ) {
                  const wallStart = { x: wall.x, y: wall.y };
                  const wallEnd = { x: wall.x + wall.length, y: wall.y };

                  if (
                    ball.nextX + ballSize / 2 >= wallStart.x - wallW / 2 &&
                    ball.nextX < wallStart.x
                  ) {
                    // Проверка столкновения с левым концом стены
                    const distance = distance2D(wallStart, {
                      x: ball.nextX,
                      y: ball.nextY,
                    });
                    if (distance < ballSize / 2 + wallW / 2) {
                      const closest = closestItCanBe(wallStart, {
                        x: ball.nextX,
                        y: ball.nextY,
                      });
                      const rolled = rollAroundCap(wallStart, {
                        x: closest.x,
                        y: closest.y,
                        velocityX: ball.velocityX,
                        velocityY: ball.velocityY,
                      });

                      Object.assign(ball, rolled);
                    }
                  }

                  if (
                    ball.nextX - ballSize / 2 <= wallEnd.x + wallW / 2 &&
                    ball.nextX > wallEnd.x
                  ) {
                    // Проверка столкновения с правым концом стены
                    const distance = distance2D(wallEnd, {
                      x: ball.nextX,
                      y: ball.nextY,
                    });
                    if (distance < ballSize / 2 + wallW / 2) {
                      const closest = closestItCanBe(wallEnd, {
                        x: ball.nextX,
                        y: ball.nextY,
                      });
                      const rolled = rollAroundCap(wallEnd, {
                        x: closest.x,
                        y: closest.y,
                        velocityX: ball.velocityX,
                        velocityY: ball.velocityY,
                      });

                      Object.assign(ball, rolled);
                    }
                  }

                  if (ball.nextX >= wallStart.x && ball.nextX <= wallEnd.x) {
                    if (ball.nextY < wall.y) {
                      ball.nextY = wall.y - wallW / 2 - ballSize / 2;
                    } else {
                      ball.nextY = wall.y + wallW / 2 + ballSize / 2;
                    }
                    ball.y = ball.nextY;
                    ball.velocityY = -ball.velocityY / 3;
                  }
                }
              } else {
                // Вертикальная стена
                if (
                  ball.nextX + ballSize / 2 >= wall.x - wallW / 2 &&
                  ball.nextX - ballSize / 2 <= wall.x + wallW / 2
                ) {
                  const wallStart = { x: wall.x, y: wall.y };
                  const wallEnd = { x: wall.x, y: wall.y + wall.length };

                  if (
                    ball.nextY + ballSize / 2 >= wallStart.y - wallW / 2 &&
                    ball.nextY < wallStart.y
                  ) {
                    // Проверка столкновения с верхним концом стены
                    const distance = distance2D(wallStart, {
                      x: ball.nextX,
                      y: ball.nextY,
                    });
                    if (distance < ballSize / 2 + wallW / 2) {
                      const closest = closestItCanBe(wallStart, {
                        x: ball.nextX,
                        y: ball.nextY,
                      });
                      const rolled = rollAroundCap(wallStart, {
                        x: closest.x,
                        y: closest.y,
                        velocityX: ball.velocityX,
                        velocityY: ball.velocityY,
                      });

                      Object.assign(ball, rolled);
                    }
                  }

                  if (
                    ball.nextY - ballSize / 2 <= wallEnd.y + wallW / 2 &&
                    ball.nextY > wallEnd.y
                  ) {
                    // Проверка столкновения с нижним концом стены
                    const distance = distance2D(wallEnd, {
                      x: ball.nextX,
                      y: ball.nextY,
                    });
                    if (distance < ballSize / 2 + wallW / 2) {
                      const closest = closestItCanBe(wallEnd, {
                        x: ball.nextX,
                        y: ball.nextY,
                      });
                      const rolled = rollAroundCap(wallEnd, {
                        x: closest.x,
                        y: closest.y,
                        velocityX: ball.velocityX,
                        velocityY: ball.velocityY,
                      });

                      Object.assign(ball, rolled);
                    }
                  }

                  if (ball.nextY >= wallStart.y && ball.nextY <= wallEnd.y) {
                    if (ball.nextX < wall.x) {
                      ball.nextX = wall.x - wallW / 2 - ballSize / 2;
                    } else {
                      ball.nextX = wall.x + wallW / 2 + ballSize / 2;
                    }
                    ball.x = ball.nextX;
                    ball.velocityX = -ball.velocityX / 3;
                  }
                }
              }
            });

            // Проверка попадания в дыры

            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
          });

          balls.forEach(({ x, y }, index) => {
            ballElements[index].style.left = `${x}px`;
            ballElements[index].style.top = `${y}px`;
          });
        }

        if (
          balls.every(
            (ball) => distance2D(ball, { x: 350 / 2, y: 315 / 2 }) < 65 / 2
          )
        ) {
          setNoteContent(`
            Поздравляем, вы справились!
            <p>
            Нажмите <span class="text-secondary text-[17px]">Е</span> для повторной игры.
            </p>
          `)
          gameInProgress = false;
        } else {
          previousTimestamp = timestamp;
          window.requestAnimationFrame(main);
        }
      } catch (error: any) {
        throw error;
      }
    };

    // Добавление слушателей событий
    joystickHeadRef.current?.addEventListener('mousedown', handleJoystickMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    // Инициализация игры
    resetGame();

    // Очистка слушателей при размонтировании
    return () => {
      joystickHeadRef.current?.removeEventListener('mousedown', handleJoystickMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div id="center" className={styles.center}>
        <div id="game" className={styles.game}>
          <div id="maze" ref={mazeRef} className={styles.maze}>
            <div id="end" className={styles.end}></div>
          </div>
          <div id="joystick" className={styles.joystick}>
            <div className={`${styles.joystickArrow} ${styles.joystickArrow1}`}></div>
            <div className={`${styles.joystickArrow} ${styles.joystickArrow2}`}></div>
            <div className={`${styles.joystickArrow} ${styles.joystickArrow3}`}></div>
            <div className={`${styles.joystickArrow} ${styles.joystickArrow4}`}></div>
            <div id="joystick-head" ref={joystickHeadRef} className={styles.joystickHead}></div>
          </div>
          <div id="note" ref={noteRef} className={styles.note}>
            Нажмите на джойстик, чтобы начать!
            <p>Переместите все шарики в центр.</p>
          </div>
          {noteContent && (
          <div
            id="note"
            className={`${styles.note} text-center`}
            dangerouslySetInnerHTML={{ __html: noteContent }}
          ></div>
        )}
        </div>
      </div>
    </>
  );
};

export default Game;
