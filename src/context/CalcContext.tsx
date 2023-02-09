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
type CircuitBreaker = (current: number) => number;
type Conductor = (
  circuitBreakerCurrent: number,
  conductorType: "CC" | "CW" | "AC" | "AW",
  earthType: "TT" | "TN-S",
  onePhase?: boolean
) => string;
type GetLargeValue = (value: number, arr: number[]) => number;
type GiveConductorArr = (
  conductorType: "CC" | "CW" | "AC" | "AW",
  earthType: "TT" | "TN-S",
  onePhase?: boolean
) => {}[];

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

  // Автомат сонгох 220/380В ...
  const circuitBreaker: CircuitBreaker = (current) => {
    const circBreaker = [
      16, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 355, 400, 500,
      630, 800, 1000, 1600,
    ];

    const circuitBreakerCurrent = getLargeValue(current, circBreaker);

    return circuitBreakerCurrent;
  };

  // Халалтын нөхцлөөр хөндлөн огтлол сонгох 220В
  const conductor: Conductor = (
    circuitBreakerCurrent,
    conductorType,
    earthType,
    onePhase
  ) => {
    return "3х2.5мм.кв";
  };

  // ########################### ТУСЛАХ ФУНКЦУУД  ################################
  // ТАБЛИЦААС ИХЭСГЭЖ АВАХ ФУНКЦ ...
  const getLargeValue: GetLargeValue = (value, arr) => {
    let largeValue = 0;

    for (const e of arr) {
      if (e < value) continue;
      largeValue = e;
      break;
    }
    return largeValue;
  };

  // Утас кабелийн массивийг ангилаад өгөх функц...
  const giveConductorArr: GiveConductorArr = (
    conductorType,
    earthType,
    onePhase
  ) => {
    let conductorArr: {}[] = [];
    // 220B ...
    const aluminumCable220 = [
      {
        section: 2.5,
        text: earthType === "TN-S" ? "3x2.5мм.кв" : "2x2.5мм.кв",
        allowCurrent: earthType === "TN-S" ? 19 : 21,
      },
      {
        section: 4,
        text: earthType === "TN-S" ? "3x4мм.кв" : "2x4мм.кв",
        allowCurrent: earthType === "TN-S" ? 27 : 29,
      },
      {
        section: 6,
        text: earthType === "TN-S" ? "3x6мм.кв" : "2x6мм.кв",
        allowCurrent: earthType === "TN-S" ? 32 : 38,
      },
      {
        section: 10,
        text: earthType === "TN-S" ? "3x10мм.кв" : "2x10мм.кв",
        allowCurrent: earthType === "TN-S" ? 42 : 55,
      },
      {
        section: 16,
        text: earthType === "TN-S" ? "3x16мм.кв" : "2x16мм.кв",
        allowCurrent: earthType === "TN-S" ? 60 : 70,
      },
      {
        section: 25,
        text: earthType === "TN-S" ? "3x25мм.кв" : "2x25мм.кв",
        allowCurrent: earthType === "TN-S" ? 75 : 90,
      },
      {
        section: 35,
        text: earthType === "TN-S" ? "3x35мм.кв" : "2x35мм.кв",
        allowCurrent: earthType === "TN-S" ? 90 : 105,
      },
      {
        section: 50,
        text: earthType === "TN-S" ? "3x50мм.кв" : "2x50мм.кв",
        allowCurrent: earthType === "TN-S" ? 110 : 135,
      },
      {
        section: 70,
        text: earthType === "TN-S" ? "3x70мм.кв" : "2x70мм.кв",
        allowCurrent: earthType === "TN-S" ? 140 : 165,
      },
      {
        section: 95,
        text: earthType === "TN-S" ? "3x95мм.кв" : "2x95мм.кв",
        allowCurrent: earthType === "TN-S" ? 170 : 200,
      },
      {
        section: 120,
        text: earthType === "TN-S" ? "3x120мм.кв" : "2x120мм.кв",
        allowCurrent: earthType === "TN-S" ? 200 : 230,
      },
      {
        section: 150,
        text: earthType === "TN-S" ? "3x150мм.кв" : "2x150мм.кв",
        allowCurrent: earthType === "TN-S" ? 235 : 270,
      },
    ];

    const aluminumWire220 = [
      {
        section: 2.5,
        text: earthType === "TN-S" ? "3x(1x2.5)мм.кв" : "2x(1x2.5)мм.кв",
        allowCurrent: earthType === "TN-S" ? 19 : 20,
      },
      {
        section: 4,
        text: earthType === "TN-S" ? "3x(1x4)мм.кв" : "2x(1x4)мм.кв",
        allowCurrent: 28,
      },
      {
        section: 6,
        text: earthType === "TN-S" ? "3x(1x6)мм.кв" : "2x(1x6)мм.кв",
        allowCurrent: earthType === "TN-S" ? 32 : 36,
      },
      {
        section: 10,
        text: earthType === "TN-S" ? "3x(1x10)мм.кв" : "2x(1x10)мм.кв",
        allowCurrent: earthType === "TN-S" ? 47 : 50,
      },
      {
        section: 16,
        text: earthType === "TN-S" ? "3x(1x16)мм.кв" : "2x(1x16)мм.кв",
        allowCurrent: 60,
      },
      {
        section: 25,
        text: earthType === "TN-S" ? "3x(1x25)мм.кв" : "2x(1x25)мм.кв",
        allowCurrent: earthType === "TN-S" ? 80 : 85,
      },
      {
        section: 35,
        text: earthType === "TN-S" ? "3x(1x35)мм.кв" : "2x(1x35)мм.кв",
        allowCurrent: earthType === "TN-S" ? 95 : 100,
      },
      {
        section: 50,
        text: earthType === "TN-S" ? "3x(1x50)мм.кв" : "2x(1x50)мм.кв",
        allowCurrent: earthType === "TN-S" ? 130 : 140,
      },
      {
        section: 70,
        text: earthType === "TN-S" ? "3x(1x70)мм.кв" : "2x(1x70)мм.кв",
        allowCurrent: earthType === "TN-S" ? 165 : 175,
      },
      {
        section: 95,
        text: earthType === "TN-S" ? "3x(1x95)мм.кв" : "2x(1x95)мм.кв",
        allowCurrent: earthType === "TN-S" ? 200 : 215,
      },
      {
        section: 120,
        text: earthType === "TN-S" ? "3x(1x120)мм.кв" : "2x(1x120)мм.кв",
        allowCurrent: earthType === "TN-S" ? 220 : 245,
      },
      {
        section: 150,
        text: earthType === "TN-S" ? "3x(1x150)мм.кв" : "2x(1x150)мм.кв",
        allowCurrent: earthType === "TN-S" ? 255 : 275,
      },
    ];

    const copperCable220 = [
      {
        section: 2.5,
        text: earthType === "TN-S" ? "3x2.5мм.кв" : "2x2.5мм.кв",
        allowCurrent: earthType === "TN-S" ? 25 : 27,
      },
      {
        section: 4,
        text: earthType === "TN-S" ? "3x4мм.кв" : "2x4мм.кв",
        allowCurrent: earthType === "TN-S" ? 35 : 38,
      },
      {
        section: 6,
        text: earthType === "TN-S" ? "3x6мм.кв" : "2x6мм.кв",
        allowCurrent: earthType === "TN-S" ? 42 : 50,
      },
      {
        section: 10,
        text: earthType === "TN-S" ? "3x10мм.кв" : "2x10мм.кв",
        allowCurrent: earthType === "TN-S" ? 55 : 70,
      },
      {
        section: 16,
        text: earthType === "TN-S" ? "3x16мм.кв" : "2x16мм.кв",
        allowCurrent: earthType === "TN-S" ? 75 : 90,
      },
      {
        section: 25,
        text: earthType === "TN-S" ? "3x25мм.кв" : "2x25мм.кв",
        allowCurrent: earthType === "TN-S" ? 95 : 115,
      },
      {
        section: 35,
        text: earthType === "TN-S" ? "3x35мм.кв" : "2x35мм.кв",
        allowCurrent: earthType === "TN-S" ? 120 : 140,
      },
      {
        section: 50,
        text: earthType === "TN-S" ? "3x50мм.кв" : "2x50мм.кв",
        allowCurrent: earthType === "TN-S" ? 145 : 175,
      },
      {
        section: 70,
        text: earthType === "TN-S" ? "3x70мм.кв" : "2x70мм.кв",
        allowCurrent: earthType === "TN-S" ? 180 : 215,
      },
      {
        section: 95,
        text: earthType === "TN-S" ? "3x95мм.кв" : "2x95мм.кв",
        allowCurrent: earthType === "TN-S" ? 220 : 260,
      },
      {
        section: 120,
        text: earthType === "TN-S" ? "3x120мм.кв" : "2x120мм.кв",
        allowCurrent: earthType === "TN-S" ? 300 : 260,
      },
      {
        section: 150,
        text: earthType === "TN-S" ? "3x150мм.кв" : "2x150мм.кв",
        allowCurrent: earthType === "TN-S" ? 305 : 350,
      },
    ];

    const copperWire220 = [
      {
        section: 2.5,
        text: earthType === "TN-S" ? "3x(1x2.5)мм.кв" : "2x(1x2.5)мм.кв",
        allowCurrent: earthType === "TN-S" ? 25 : 27,
      },
      {
        section: 4,
        text: earthType === "TN-S" ? "3x(1x4)мм.кв" : "2x(1x4)мм.кв",
        allowCurrent: earthType === "TN-S" ? 35 : 38,
      },
      {
        section: 6,
        text: earthType === "TN-S" ? "3x(1x6)мм.кв" : "2x(1x6)мм.кв",
        allowCurrent: earthType === "TN-S" ? 42 : 46,
      },
      {
        section: 10,
        text: earthType === "TN-S" ? "3x(1x10)мм.кв" : "2x(1x10)мм.кв",
        allowCurrent: earthType === "TN-S" ? 60 : 70,
      },
      {
        section: 16,
        text: earthType === "TN-S" ? "3x(1x16)мм.кв" : "2x(1x16)мм.кв",
        allowCurrent: earthType === "TN-S" ? 80 : 85,
      },
      {
        section: 25,
        text: earthType === "TN-S" ? "3x(1x25)мм.кв" : "2x(1x25)мм.кв",
        allowCurrent: earthType === "TN-S" ? 100 : 115,
      },
      {
        section: 35,
        text: earthType === "TN-S" ? "3x(1x35)мм.кв" : "2x(1x35)мм.кв",
        allowCurrent: earthType === "TN-S" ? 125 : 135,
      },
      {
        section: 50,
        text: earthType === "TN-S" ? "3x(1x50)мм.кв" : "2x(1x50)мм.кв",
        allowCurrent: earthType === "TN-S" ? 170 : 185,
      },
      {
        section: 70,
        text: earthType === "TN-S" ? "3x(1x70)мм.кв" : "2x(1x70)мм.кв",
        allowCurrent: earthType === "TN-S" ? 210 : 225,
      },
      {
        section: 95,
        text: earthType === "TN-S" ? "3x(1x95)мм.кв" : "2x(1x95)мм.кв",
        allowCurrent: earthType === "TN-S" ? 255 : 275,
      },
      {
        section: 120,
        text: earthType === "TN-S" ? "3x(1x120)мм.кв" : "2x(1x120)мм.кв",
        allowCurrent: earthType === "TN-S" ? 290 : 315,
      },
      {
        section: 150,
        text: earthType === "TN-S" ? "3x(1x150)мм.кв" : "2x(1x150)мм.кв",
        allowCurrent: earthType === "TN-S" ? 330 : 360,
      },
    ];

    // 380B ...
    const aluminumCable380 = [
      {
        section: 2.5,
        text: earthType === "TN-S" ? "5x2.5мм.кв" : "4x2.5мм.кв",
        allowCurrent: earthType === "TN-S" ? 17 : 17,
      },
      {
        section: 4,
        text: earthType === "TN-S" ? "5x4мм.кв" : "4x4мм.кв",
        allowCurrent: earthType === "TN-S" ? 24 : 24,
      },
      {
        section: 6,
        text: earthType === "TN-S" ? "5x6мм.кв" : "4x6мм.кв",
        allowCurrent: earthType === "TN-S" ? 29 : 29,
      },
      {
        section: 10,
        text: earthType === "TN-S" ? "5x10мм.кв" : "4x10мм.кв",
        allowCurrent: earthType === "TN-S" ? 38 : 38,
      },
      {
        section: 16,
        text: earthType === "TN-S" ? "5x16мм.кв" : "4x16мм.кв",
        allowCurrent: earthType === "TN-S" ? 54 : 54,
      },
      {
        section: 25,
        text: earthType === "TN-S" ? "4x25+1x16мм.кв" : "3x25+1x16мм.кв",
        allowCurrent: earthType === "TN-S" ? 68 : 68,
      },
      {
        section: 35,
        text: earthType === "TN-S" ? "4x35+1x25мм.кв" : "3x35+1x25мм.кв",
        allowCurrent: earthType === "TN-S" ? 81 : 81,
      },
      {
        section: 50,
        text: earthType === "TN-S" ? "4x50+1x25мм.кв" : "3x50+1x25мм.кв",
        allowCurrent: earthType === "TN-S" ? 100 : 100,
      },
      {
        section: 70,
        text: earthType === "TN-S" ? "4x70+1x35мм.кв" : "3x70+1x35мм.кв",
        allowCurrent: earthType === "TN-S" ? 126 : 126,
      },
      {
        section: 95,
        text: earthType === "TN-S" ? "4x95+1x50мм.кв" : "3x95+1x50мм.кв",
        allowCurrent: earthType === "TN-S" ? 153 : 153,
      },
      {
        section: 120,
        text: earthType === "TN-S" ? "4x120+1x70мм.кв" : "3x120+1x70мм.кв",
        allowCurrent: earthType === "TN-S" ? 190 : 190,
      },
      {
        section: 150,
        text: earthType === "TN-S" ? "4x150+1x95мм.кв" : "3x150+1x95мм.кв",
        allowCurrent: earthType === "TN-S" ? 212 : 212,
      },
      {
        section: 185,
        text: earthType === "TN-S" ? "4x185+1x95мм.кв" : "3x185+1x95мм.кв",
        allowCurrent: earthType === "TN-S" ? 241 : 241,
      },
      {
        section: 240,
        text: earthType === "TN-S" ? "4x240+1x120мм.кв" : "3x240+1x120мм.кв",
        allowCurrent: earthType === "TN-S" ? 274 : 274,
      },
    ];

    const copperCable380 = [
      {
        section: 2.5,
        text: earthType === "TN-S" ? "5x2.5мм.кв" : "4x2.5мм.кв",
        allowCurrent: earthType === "TN-S" ? 22 : 22,
      },
      {
        section: 4,
        text: earthType === "TN-S" ? "5x4мм.кв" : "4x4мм.кв",
        allowCurrent: earthType === "TN-S" ? 31 : 31,
      },
      {
        section: 6,
        text: earthType === "TN-S" ? "5x6мм.кв" : "4x6мм.кв",
        allowCurrent: earthType === "TN-S" ? 38 : 38,
      },
      {
        section: 10,
        text: earthType === "TN-S" ? "5x10мм.кв" : "4x10мм.кв",
        allowCurrent: earthType === "TN-S" ? 50 : 50,
      },
      {
        section: 16,
        text: earthType === "TN-S" ? "5x16мм.кв" : "4x16мм.кв",
        allowCurrent: earthType === "TN-S" ? 68 : 68,
      },
      {
        section: 25,
        text: earthType === "TN-S" ? "4x25+1x16мм.кв" : "3x25+1x16мм.кв",
        allowCurrent: earthType === "TN-S" ? 85 : 85,
      },
      {
        section: 35,
        text: earthType === "TN-S" ? "4x35+1x25мм.кв" : "3x35+1x25мм.кв",
        allowCurrent: earthType === "TN-S" ? 108 : 108,
      },
      {
        section: 50,
        text: earthType === "TN-S" ? "4x50+1x25мм.кв" : "3x50+1x25мм.кв",
        allowCurrent: earthType === "TN-S" ? 130 : 130,
      },
      {
        section: 70,
        text: earthType === "TN-S" ? "4x70+1x35мм.кв" : "3x70+1x35мм.кв",
        allowCurrent: earthType === "TN-S" ? 162 : 162,
      },
      {
        section: 95,
        text: earthType === "TN-S" ? "4x95+1x50мм.кв" : "3x95+1x50мм.кв",
        allowCurrent: earthType === "TN-S" ? 200 : 200,
      },
      {
        section: 120,
        text: earthType === "TN-S" ? "4x120+1x70мм.кв" : "3x120+1x70мм.кв",
        allowCurrent: earthType === "TN-S" ? 234 : 234,
      },
      {
        section: 150,
        text: earthType === "TN-S" ? "4x150+1x95мм.кв" : "3x150+1x95мм.кв",
        allowCurrent: earthType === "TN-S" ? 275 : 275,
      },
      {
        section: 185,
        text: earthType === "TN-S" ? "4x185+1x95мм.кв" : "3x185+1x95мм.кв",
        allowCurrent: earthType === "TN-S" ? 308 : 308,
      },
      {
        section: 240,
        text: earthType === "TN-S" ? "4x240+1x120мм.кв" : "3x240+1x120мм.кв",
        allowCurrent: earthType === "TN-S" ? 355 : 355,
      },
    ];

    const aluminumWire380 = [
      {
        section: 2.5,
        text: earthType === "TN-S" ? "5x(1x2.5)мм.кв" : "4x(1x2.5)мм.кв",
        allowCurrent: earthType === "TN-S" ? 15 : 19,
      },
      {
        section: 4,
        text: earthType === "TN-S" ? "5x(1x4)мм.кв" : "4x(1x4)мм.кв",
        allowCurrent: earthType === "TN-S" ? 22 : 23,
      },
      {
        section: 6,
        text: earthType === "TN-S" ? "5x(1x6)мм.кв" : "4x(1x6)мм.кв",
        allowCurrent: earthType === "TN-S" ? 26 : 30,
      },
      {
        section: 10,
        text: earthType === "TN-S" ? "5x(1x10)мм.кв" : "4x(1x10)мм.кв",
        allowCurrent: earthType === "TN-S" ? 38 : 39,
      },
      {
        section: 16,
        text: earthType === "TN-S" ? "5x(1x16)мм.кв" : "4x(1x16)мм.кв",
        allowCurrent: earthType === "TN-S" ? 48 : 55,
      },
      {
        section: 25,
        text:
          earthType === "TN-S"
            ? "4x(1x25)+(1x16)мм.кв"
            : "3x(1x25)+(1x16)мм.кв",
        allowCurrent: earthType === "TN-S" ? 65 : 70,
      },
      {
        section: 35,
        text:
          earthType === "TN-S"
            ? "4x(1x35)+(1x25)мм.кв"
            : "3x(1x35)+(1x25)мм.кв",
        allowCurrent: earthType === "TN-S" ? 75 : 85,
      },
      {
        section: 50,
        text:
          earthType === "TN-S"
            ? "4x(1x50)+(1x25)мм.кв"
            : "3x(1x50)+(1x25)мм.кв",
        allowCurrent: earthType === "TN-S" ? 105 : 120,
      },
      {
        section: 70,
        text:
          earthType === "TN-S"
            ? "4x(1x70)+(1x35)мм.кв"
            : "3x(1x70)+(1x35)мм.кв",
        allowCurrent: earthType === "TN-S" ? 130 : 140,
      },
      {
        section: 95,
        text:
          earthType === "TN-S"
            ? "4x(1x95)+(1x50)мм.кв"
            : "3x(1x95)+(1x50)мм.кв",
        allowCurrent: earthType === "TN-S" ? 175 : 175,
      },
      {
        section: 120,
        text:
          earthType === "TN-S"
            ? "4x(1x120)+(1x70)мм.кв"
            : "3x(1x120)+(1x70)мм.кв",
        allowCurrent: earthType === "TN-S" ? 200 : 200,
      },
    ];

    const copperWire380 = [
      {
        section: 2.5,
        text: earthType === "TN-S" ? "5x(1x2.5)мм.кв" : "4x(1x2.5)мм.кв",
        allowCurrent: earthType === "TN-S" ? 20 : 25,
      },
      {
        section: 4,
        text: earthType === "TN-S" ? "5x(1x4)мм.кв" : "4x(1x4)мм.кв",
        allowCurrent: earthType === "TN-S" ? 28 : 30,
      },
      {
        section: 6,
        text: earthType === "TN-S" ? "5x(1x6)мм.кв" : "4x(1x6)мм.кв",
        allowCurrent: earthType === "TN-S" ? 34 : 40,
      },
      {
        section: 10,
        text: earthType === "TN-S" ? "5x(1x10)мм.кв" : "4x(1x10)мм.кв",
        allowCurrent: earthType === "TN-S" ? 48 : 50,
      },
      {
        section: 16,
        text: earthType === "TN-S" ? "5x(1x16)мм.кв" : "4x(1x16)мм.кв",
        allowCurrent: earthType === "TN-S" ? 64 : 75,
      },
      {
        section: 25,
        text:
          earthType === "TN-S"
            ? "4x(1x25)+(1x16)мм.кв"
            : "3x(1x25)+(1x16)мм.кв",
        allowCurrent: earthType === "TN-S" ? 80 : 90,
      },
      {
        section: 35,
        text:
          earthType === "TN-S"
            ? "4x(1x35)+(1x25)мм.кв"
            : "3x(1x35)+(1x25)мм.кв",
        allowCurrent: earthType === "TN-S" ? 100 : 115,
      },
      {
        section: 50,
        text:
          earthType === "TN-S"
            ? "4x(1x50)+(1x25)мм.кв"
            : "3x(1x50)+(1x25)мм.кв",
        allowCurrent: earthType === "TN-S" ? 135 : 150,
      },
      {
        section: 70,
        text:
          earthType === "TN-S"
            ? "4x(1x70)+(1x35)мм.кв"
            : "3x(1x70)+(1x35)мм.кв",
        allowCurrent: earthType === "TN-S" ? 165 : 185,
      },
      {
        section: 95,
        text:
          earthType === "TN-S"
            ? "4x(1x95)+(1x50)мм.кв"
            : "3x(1x95)+(1x50)мм.кв",
        allowCurrent: earthType === "TN-S" ? 255 : 255,
      },
      {
        section: 120,
        text:
          earthType === "TN-S"
            ? "4x(1x120)+(1x70)мм.кв"
            : "3x(1x120)+(1x70)мм.кв",
        allowCurrent: earthType === "TN-S" ? 260 : 260,
      },
      {
        section: 150,
        text:
          earthType === "TN-S"
            ? "4x(1x150)+(1x95)мм.кв"
            : "3x(1x150)+(1x95)мм.кв",
        allowCurrent: earthType === "TN-S" ? 300 : 300,
      },
      {
        section: 185,
        text:
          earthType === "TN-S"
            ? "4x(1x185)+(1x95)мм.кв"
            : "3x(1x185)+(1x95)мм.кв",
        allowCurrent: earthType === "TN-S" ? 346 : 346,
      },
      {
        section: 240,
        text:
          earthType === "TN-S"
            ? "4x(1x240)+(1x120)мм.кв"
            : "3x(1x240)+(1x120)мм.кв",
        allowCurrent: earthType === "TN-S" ? 397 : 397,
      },
    ];

    if (onePhase) {
      if (conductorType === "AC") conductorArr = [...aluminumCable220];
      if (conductorType === "AW") conductorArr = [...aluminumWire220];
      if (conductorType === "CC") conductorArr = [...copperCable220];
      if (conductorType === "CW") conductorArr = [...copperWire220];
    } else {
      if (conductorType === "AC") conductorArr = [...aluminumCable380];
      if (conductorType === "AW") conductorArr = [...aluminumWire380];
      if (conductorType === "CC") conductorArr = [...copperCable380];
      if (conductorType === "CW") conductorArr = [...copperWire380];
    }

    return conductorArr;
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
