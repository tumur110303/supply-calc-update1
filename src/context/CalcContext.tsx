import { FC, createContext } from "react";

const CalcContext = createContext<{
  calcPlumbCoeff: CalcPlumbCoeff;
  elevatorCoeff: ElevatorCoeff;
  interpolation: Interpolation;
  ptbCalc: PtbCalc;
  equilentPowerFactor: EquilentPowerFactor;
} | null>(null);

type EquilentPowerFactor = (loads: number[], pfs: number[]) => number;

type PtbCalc = (capacity: number, transformerNumber: number) => string;

type CalcPlumbCoeff = (value: number) => number;
type Interpolation = (
  userValue: number,
  key: number[],
  value: number[]
) => number;
type ElevatorCoeff = (value: number, twelveFloor: boolean) => number;

// ЗАССАН TYPES...
type CurrentOnePhase = (
  load: number,
  powerFactor: number,
  mainUnit?: boolean
) => number;
type CircuitBreakerOnePhase = (current: number) => number;
type Conductor = (
  circuitBreakerCurrent: number,
  conductorType: string,
  earthType: "TT" | "TN-S",
  onePhase?: boolean
) => string;

// ########################## ҮНДСЭН ФУНКЦ ################################
export const CalcStore: FC = ({ children }) => {
  // Сантехникийн шаардлагын итгэлцүүр тодорхойлоход шаардлагатай өгөгдлүүд...
  const numberTab = [2, 3, 5, 8, 10, 15, 20, 30, 50, 100, 200];
  const coefficientPlumbTab = [
    1, 0.9, 0.8, 0.75, 0.7, 0.65, 0.65, 0.6, 0.55, 0.55, 0.5,
  ];
  // Лифтний шаардлагын итгэлцүүр тодорхойлох өгөгдлүүд...
  const numberElevatorTab = [3, 5, 6, 10, 20, 25];
  const moreThanTwelve = [0.9, 0.8, 0.75, 0.6, 0.5, 0.4];
  const lessThanTwelve = [0.8, 0.7, 0.65, 0.5, 0.4, 0.35];

  // Дэд станц сонгох...
  const ptbCalc: PtbCalc = (capacity: number, transformerNumber: number) => {
    const powerTableTp = [
      25, 40, 63, 100, 160, 250, 320, 400, 500, 630, 800, 1000, 1600, 2500,
      4000, 6300, 10000, 16000, 25000, 40000,
    ];

    const transformerPower = (arr: number[]) => {
      if (transformerNumber === 1) {
        for (let e of arr) {
          if (e < capacity) continue;

          return e;
        }
      } else if (transformerNumber === 2) {
        const calcCapacity = capacity / 1.4;

        for (let e of arr) {
          if (e < calcCapacity) continue;

          return e;
        }
      }
    };

    const tpPower = transformerPower(powerTableTp);

    const butsaahUtgaString = `${transformerNumber}x${tpPower} кВА 6(10)/0.4кВ-ын дэд станц`;

    return butsaahUtgaString;
  };

  // Интерполяц хийх утга буцаадаг функц...
  const interpolation: Interpolation = (userValue, key, value) => {
    if (userValue < key[0] + 1) return value[0];
    else if (userValue > key[key.length - 1] - 1)
      return value[value.length - 1];
    else {
      const minKeys: number[] = key.filter((e) => {
        if (userValue > e) return e;
      });

      const firstKey = minKeys[minKeys.length - 1];
      const nextKey = key[minKeys.length];
      const firstValue = value[minKeys.length - 1];
      const nextValue = value[minKeys.length];

      const difference1 = userValue - nextKey;
      const difference2 = firstKey - nextKey;
      const difference3 = userValue - firstKey;
      const difference4 = nextKey - firstKey;

      const item1 = (difference1 / difference2) * firstValue;
      const item2 = (difference3 / difference4) * nextValue;

      return item1 + item2;
    }
  };

  // Сангийн шаардлагын итгэлцүүр тодорхойлох функц...
  const calcPlumbCoeff: CalcPlumbCoeff = (value) => {
    let coeff: number = 0;
    if (value == 3) coeff = 0.9;
    else if (value == 200) coeff = 0.5;
    if (value > 3 && value < 200)
      coeff = interpolation(value, numberTab, coefficientPlumbTab);
    if (value < 3) coeff = 1;
    if (value > 200) coeff = 0.5;

    return coeff;
  };

  // Лифтний шаардлагын итгэлцүүр тодорхойлох функцууд...
  const elevatorCoeff: ElevatorCoeff = (value, twelveFloor) => {
    let coeffElevator = 0;

    if (twelveFloor) {
      if (value == 1) coeffElevator = 1;
      else if (value < 4) coeffElevator = 0.9;
      else if (value < 6) coeffElevator = 0.8;
      else if (value == 6) coeffElevator = 0.75;
      else if (value > 6 && value < 10) {
        coeffElevator = interpolation(value, numberElevatorTab, moreThanTwelve);
      } else if (value == 10) coeffElevator = 0.6;
      else if (value > 10 && value < 20) {
        coeffElevator = interpolation(value, numberElevatorTab, moreThanTwelve);
      } else if (value == 20) coeffElevator = 0.5;
      else if (value > 20 && value < 26) {
        coeffElevator = interpolation(value, numberElevatorTab, moreThanTwelve);
      } else coeffElevator = 0.4;
    } else {
      if (value == 1) coeffElevator = 1;
      else if (value < 4) coeffElevator = 0.8;
      else if (value < 6) coeffElevator = 0.7;
      else if (value == 6) coeffElevator = 0.65;
      else if (value > 6 && value < 10) {
        coeffElevator = interpolation(value, numberElevatorTab, lessThanTwelve);
      } else if (value == 10) coeffElevator = 0.5;
      else if (value > 10 && value < 20) {
        coeffElevator = interpolation(value, numberElevatorTab, lessThanTwelve);
      } else if (value == 20) coeffElevator = 0.4;
      else if (value > 20 && value < 26) {
        coeffElevator = interpolation(value, numberElevatorTab, lessThanTwelve);
      } else coeffElevator = 0.35;
    }

    return coeffElevator;
  };

  // Дундаж чадлын коэффициент...
  const equilentPowerFactor: EquilentPowerFactor = (loads, pf) => {
    const nemegdehuun = loads.map((el, i) => el * pf[i]);

    let sum1 = 0;
    let sum2 = 0;

    const hurtwer: number = nemegdehuun.reduce((a, b) => a + b);
    const huwaari: number = loads.reduce((a, b) => a + b);

    const powerFactor = hurtwer / huwaari;

    return powerFactor;
  };

  // #########################  Засвартай...   #####################

  // ######################### ~220 Bольт  #########################

  // Гүйдэл тооцох 220B ...
  const currentOnePhase: CurrentOnePhase = (load, powerFactor, mainUnit) => {
    let huwaari = 0;
    let current = 0;

    if (mainUnit) {
      huwaari = 220 * powerFactor;
      current = load / huwaari;
    } else {
      huwaari = 220 * powerFactor;
      current = (1000 * load) / huwaari;
    }
    return current;
  };

  // Автомат сонгох 220В ...
  const circuitBreakerOnePhase: CircuitBreakerOnePhase = (current) => {
    let circuitBreakerCurrent = 0;
    const circBreaker = [16, 25, 32, 40, 50, 63, 80, 100, 125, 160];

    // Тооцоолол 1 фазын автомат
    for (const e of circBreaker) {
      if (e < current) continue;
      circuitBreakerCurrent = e;
      break;
    }

    return circuitBreakerCurrent;
  };

  // Халалтын нөхцлөөр хөндлөн огтлол сонгох 220В
  const conductor: Conductor = (
    circuitBreakerCurrent,
    conductorType,
    earthType,
    onePhase
  ) => {
    // Утас кабелийн таблиц...
    // 220B...
    const aluminumCable220 = [
      {
        section: 2.5,
        text: earthType === "TN-S" ? "3x2.5мм.кв" : "2x2.5",
        allowCurrent: earthType === "TN-S" ? 19 : 21,
      },
      {
        section: 4,
        text: earthType === "TN-S" ? "3x4мм.кв" : "2x4",
        allowCurrent: earthType === "TN-S" ? 27 : 29,
      },
      {
        section: 6,
        text: earthType === "TN-S" ? "3x6мм.кв" : "2x6",
        allowCurrent: earthType === "TN-S" ? 32 : 38,
      },
      {
        section: 10,
        text: earthType === "TN-S" ? "3x10мм.кв" : "2x10",
        allowCurrent: earthType === "TN-S" ? 42 : 55,
      },
      {
        section: 16,
        text: earthType === "TN-S" ? "3x16мм.кв" : "2x16",
        allowCurrent: earthType === "TN-S" ? 60 : 70,
      },
      {
        section: 25,
        text: earthType === "TN-S" ? "3x25мм.кв" : "2x25",
        allowCurrent: earthType === "TN-S" ? 75 : 90,
      },
      {
        section: 35,
        text: earthType === "TN-S" ? "3x35мм.кв" : "2x35",
        allowCurrent: earthType === "TN-S" ? 90 : 105,
      },
      {
        section: 50,
        text: earthType === "TN-S" ? "3x50мм.кв" : "2x50",
        allowCurrent: earthType === "TN-S" ? 110 : 135,
      },
      {
        section: 70,
        text: earthType === "TN-S" ? "3x70мм.кв" : "2x70",
        allowCurrent: earthType === "TN-S" ? 140 : 165,
      },
      {
        section: 95,
        text: earthType === "TN-S" ? "3x95мм.кв" : "2x95",
        allowCurrent: earthType === "TN-S" ? 170 : 200,
      },
    ];

    return "3х2.5мм.кв";
  };

  return (
    <CalcContext.Provider
      value={{
        calcPlumbCoeff,
        elevatorCoeff,
        interpolation,
        ptbCalc,
        equilentPowerFactor,
      }}
    >
      {children}
    </CalcContext.Provider>
  );
};

export default CalcContext;
