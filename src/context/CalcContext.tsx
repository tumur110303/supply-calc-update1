import { FC, createContext } from "react";

const CalcContext = createContext<{
  currentThreePhase: CurrentThreePhase;
  voltageDrop: VoltageDrop;
  circuitBreaker: CircuitBreaker;
  apartmentCalc: ApartmentCalc;
  conductor: Conductor;
  calcPlumb: CalcPlumb;
  elevatorCalc: ElevatorCalc;
  interpolation: Interpolation;
  ptbCalc: PtbCalc;
  currentOnePhase: CurrentOnePhase;
  equilentPowerFactor: EquilentPowerFactor;
  classifyPlumbLoad: ClassifyPlumbLoad;
} | null>(null);

type EquilentPowerFactor = (loads: number[], pfs: number[]) => number | string;

type PtbCalc = (capacity: number, transformerNumber: number) => string;

type CalcPlumb = (value: number, load: number) => number;
type Interpolation = (
  userValue: number,
  key: number[],
  value: number[]
) => number;
type ElevatorCalc = (
  value: number,
  load: number,
  twelveFloor: boolean
) => number;

// ЗАССАН TYPES...
type CurrentOnePhase = (
  load: number,
  powerFactor: number,
  mainUnit?: boolean
) => number;
type CircuitBreaker = (current: number) => number | string;
type Conductor = (
  circuitBreakerCurrent: number,
  conductorType: "CC" | "CW" | "AC" | "AW",
  earthType?: boolean,
  onePhase?: boolean
) => string | object;
type GetLargeValue = (value: number, arr: number[]) => number | string;
type ApartmentCalc = (numberApartment: number) => number;
type ClassifyPlumbLoad = (loads: number[]) => object;
type CurrentThreePhase = (
  load: number,
  powerFactor: number,
  delta?: number,
  mainUnit?: boolean
) => number;
type VoltageDrop = (
  load: number,
  length: number,
  section: number,
  material: "CC" | "CW" | "AC" | "AW",
  onePhase?: boolean
) => number;
type GiveC = (
  conductorMaterial: "CC" | "CW" | "AC" | "AW",
  onePhase?: boolean
) => number;
type SectionFromDrop = (
  load: number,
  length: number,
  allowDrop: number,
  material: "CC" | "CW" | "AC" | "AW",
  onePhase?: boolean
) => number | string;

// ########################## ҮНДСЭН ФУНКЦ ################################
export const CalcStore: FC = ({ children }) => {
  // Сууцны ачаалал тодорхойлоход шаардлагатай өгөгдлүүд...
  const numberTabAppartment = [
    3, 4, 5, 6, 9, 12, 15, 18, 24, 40, 60, 100, 200, 400, 600, 1000,
  ];
  const privLoadTab = [
    10, 7.5, 6, 5.1, 3.8, 3.2, 2.8, 2.6, 2.2, 1.95, 1.7, 1.5, 1.36, 1.27, 1.23,
    1.19,
  ];
  // Сантехникийн шаардлагын итгэлцүүр тодорхойлоход шаардлагатай өгөгдлүүд...
  const numberTabPlumb = [2, 3, 5, 8, 10, 15, 20, 30, 50, 100, 200];
  const coefficientPlumbTab = [
    1, 0.9, 0.8, 0.75, 0.7, 0.65, 0.65, 0.6, 0.55, 0.55, 0.5,
  ];
  // Лифтний шаардлагын итгэлцүүр тодорхойлох өгөгдлүүд...
  const numberElevatorTab = [3, 5, 6, 10, 20, 25];
  const moreThanTwelve = [0.9, 0.8, 0.75, 0.6, 0.5, 0.4];
  const lessThanTwelve = [0.8, 0.7, 0.65, 0.5, 0.4, 0.35];

  // ##########################  ТООЦООНЫ ФУНКЦУУД ... ###############################
  // Дэд станц сонгох...
  const ptbCalc = (capacity: number, transformerNumber: number) => {
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

  // Сууцны ачаалал тодорхойлох функц ...
  const apartmentCalc = (numberApartment: number) => {
    const privLoad = interpolation(
      numberApartment,
      numberTabAppartment,
      privLoadTab
    );
    const apartmentLoad = numberApartment * privLoad;
    return apartmentLoad;
  };

  // Сангийн ачаалал тодорхойлох функц...
  const calcPlumb = (numberEquipment: number, totalLoad: number) => {
    let coeff: number = 0;
    if (numberEquipment == 3) coeff = 0.9;
    else if (numberEquipment == 200) coeff = 0.5;
    if (numberEquipment > 3 && numberEquipment < 200)
      coeff = interpolation(
        numberEquipment,
        numberTabPlumb,
        coefficientPlumbTab
      );
    if (numberEquipment < 3) coeff = 1;
    if (numberEquipment > 200) coeff = 0.5;

    const plumbLoad = totalLoad * coeff;

    return plumbLoad;
  };

  // Лифтний ачаалал тодорхойлох функцууд...
  const elevatorCalc = (
    numberEquipment: number,
    totalLoad: number,
    moreThanFloor: boolean
  ) => {
    let coeffElevator = 0;

    if (moreThanFloor) {
      if (numberEquipment == 1) coeffElevator = 1;
      else if (numberEquipment < 4) coeffElevator = 0.9;
      else if (numberEquipment < 6) coeffElevator = 0.8;
      else if (numberEquipment == 6) coeffElevator = 0.75;
      else if (numberEquipment > 6 && numberEquipment < 10) {
        coeffElevator = interpolation(
          numberEquipment,
          numberElevatorTab,
          moreThanTwelve
        );
      } else if (numberEquipment == 10) coeffElevator = 0.6;
      else if (numberEquipment > 10 && numberEquipment < 20) {
        coeffElevator = interpolation(
          numberEquipment,
          numberElevatorTab,
          moreThanTwelve
        );
      } else if (numberEquipment == 20) coeffElevator = 0.5;
      else if (numberEquipment > 20 && numberEquipment < 26) {
        coeffElevator = interpolation(
          numberEquipment,
          numberElevatorTab,
          moreThanTwelve
        );
      } else coeffElevator = 0.4;
    } else {
      if (numberEquipment == 1) coeffElevator = 1;
      else if (numberEquipment < 4) coeffElevator = 0.8;
      else if (numberEquipment < 6) coeffElevator = 0.7;
      else if (numberEquipment == 6) coeffElevator = 0.65;
      else if (numberEquipment > 6 && numberEquipment < 10) {
        coeffElevator = interpolation(
          numberEquipment,
          numberElevatorTab,
          lessThanTwelve
        );
      } else if (numberEquipment == 10) coeffElevator = 0.5;
      else if (numberEquipment > 10 && numberEquipment < 20) {
        coeffElevator = interpolation(
          numberEquipment,
          numberElevatorTab,
          lessThanTwelve
        );
      } else if (numberEquipment == 20) coeffElevator = 0.4;
      else if (numberEquipment > 20 && numberEquipment < 26) {
        coeffElevator = interpolation(
          numberEquipment,
          numberElevatorTab,
          lessThanTwelve
        );
      } else coeffElevator = 0.35;
    }

    const elevatorLoad = totalLoad * coeffElevator;
    return elevatorLoad;
  };

  // Дундаж чадлын коэффициент...
  const equilentPowerFactor: EquilentPowerFactor = (loads, pf) => {
    if (loads.length !== pf.length)
      return "Уучлаарай. Та өгөгдлөө гүйцэд оруулна уу!";

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

  // Гүйдэл тооцох 380B ...
  const currentThreePhase: CurrentThreePhase = (
    load,
    powerFactor,
    delta,
    mainUnit
  ) => {
    let huwaari = 0;
    let current = 0;
    const threeSquart = Math.sqrt(3);

    if (mainUnit) {
      if (delta) {
        huwaari = 380 * powerFactor;
        current = load / huwaari;
      } else {
        huwaari = 380 * powerFactor * threeSquart;
        current = load / huwaari;
      }
    } else {
      if (delta) {
        huwaari = 380 * powerFactor;
        current = (1000 * load) / huwaari;
      } else {
        huwaari = 380 * powerFactor * threeSquart;
        current = (1000 * load) / huwaari;
      }
    }
    return current;
  };

  // Хүчдэлийн алдагдал тооцох 380В...
  const voltageDrop: VoltageDrop = (
    load,
    length,
    section,
    material,
    onePhase
  ) => {
    const c = giveC(material, onePhase);
    const hurtwer = load * length;
    const huwaari = c * section;
    const drop = hurtwer / huwaari;

    return drop;
  };

  // Хүчдэлийн алдагдлаар хөндлөн огтлол сонгох...
  const sectionFromDrop: SectionFromDrop = (
    load,
    length,
    allowDrop,
    material,
    onePhase
  ) => {
    const arrConductor = [
      2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240,
    ];
    const c = giveC(material, onePhase);
    const hurtwer = load * length;
    const huwaari = c * allowDrop;
    const real = hurtwer / huwaari;

    const sectionDrop = getLargeValue(real, arrConductor);

    return sectionDrop;
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

  // Халалтын нөхцлөөр хөндлөн огтлол сонгох...
  const conductor: Conductor = (
    circuitBreakerCurrent,
    conductorType,
    earthType,
    onePhase
  ) => {
    // 220B ...
    const aluminumCable220 = [
      {
        section: 2.5,
        text: (earthType) ? "3x2.5мм.кв" : "2x2.5мм.кв",
        allowCurrent: (earthType) ? 19 : 21,
      },
      {
        section: 4,
        text: (earthType) ? "3x4мм.кв" : "2x4мм.кв",
        allowCurrent: (earthType) ? 27 : 29,
      },
      {
        section: 6,
        text: (earthType) ? "3x6мм.кв" : "2x6мм.кв",
        allowCurrent: (earthType) ? 32 : 38,
      },
      {
        section: 10,
        text: (earthType) ? "3x10мм.кв" : "2x10мм.кв",
        allowCurrent: (earthType) ? 42 : 55,
      },
      {
        section: 16,
        text: (earthType) ? "3x16мм.кв" : "2x16мм.кв",
        allowCurrent: (earthType) ? 60 : 70,
      },
      {
        section: 25,
        text: (earthType) ? "3x25мм.кв" : "2x25мм.кв",
        allowCurrent: (earthType) ? 75 : 90,
      },
      {
        section: 35,
        text: (earthType) ? "3x35мм.кв" : "2x35мм.кв",
        allowCurrent: (earthType) ? 90 : 105,
      },
      {
        section: 50,
        text: (earthType) ? "3x50мм.кв" : "2x50мм.кв",
        allowCurrent: (earthType) ? 110 : 135,
      },
      {
        section: 70,
        text: (earthType) ? "3x70мм.кв" : "2x70мм.кв",
        allowCurrent: (earthType) ? 140 : 165,
      },
      {
        section: 95,
        text: (earthType) ? "3x95мм.кв" : "2x95мм.кв",
        allowCurrent: (earthType) ? 170 : 200,
      },
      {
        section: 120,
        text: (earthType) ? "3x120мм.кв" : "2x120мм.кв",
        allowCurrent: (earthType) ? 200 : 230,
      },
      {
        section: 150,
        text: (earthType) ? "3x150мм.кв" : "2x150мм.кв",
        allowCurrent: (earthType) ? 235 : 270,
      },
    ];

    const aluminumWire220 = [
      {
        section: 2.5,
        text: (earthType) ? "3x(1x2.5)мм.кв" : "2x(1x2.5)мм.кв",
        allowCurrent: (earthType) ? 19 : 20,
      },
      {
        section: 4,
        text: (earthType) ? "3x(1x4)мм.кв" : "2x(1x4)мм.кв",
        allowCurrent: 28,
      },
      {
        section: 6,
        text: (earthType) ? "3x(1x6)мм.кв" : "2x(1x6)мм.кв",
        allowCurrent: (earthType) ? 32 : 36,
      },
      {
        section: 10,
        text: (earthType) ? "3x(1x10)мм.кв" : "2x(1x10)мм.кв",
        allowCurrent: (earthType) ? 47 : 50,
      },
      {
        section: 16,
        text: (earthType) ? "3x(1x16)мм.кв" : "2x(1x16)мм.кв",
        allowCurrent: 60,
      },
      {
        section: 25,
        text: (earthType) ? "3x(1x25)мм.кв" : "2x(1x25)мм.кв",
        allowCurrent: (earthType) ? 80 : 85,
      },
      {
        section: 35,
        text: (earthType) ? "3x(1x35)мм.кв" : "2x(1x35)мм.кв",
        allowCurrent: (earthType) ? 95 : 100,
      },
      {
        section: 50,
        text: (earthType) ? "3x(1x50)мм.кв" : "2x(1x50)мм.кв",
        allowCurrent: (earthType) ? 130 : 140,
      },
      {
        section: 70,
        text: (earthType) ? "3x(1x70)мм.кв" : "2x(1x70)мм.кв",
        allowCurrent: (earthType) ? 165 : 175,
      },
      {
        section: 95,
        text: (earthType) ? "3x(1x95)мм.кв" : "2x(1x95)мм.кв",
        allowCurrent: (earthType) ? 200 : 215,
      },
      {
        section: 120,
        text: (earthType) ? "3x(1x120)мм.кв" : "2x(1x120)мм.кв",
        allowCurrent: (earthType) ? 220 : 245,
      },
      {
        section: 150,
        text: (earthType) ? "3x(1x150)мм.кв" : "2x(1x150)мм.кв",
        allowCurrent: (earthType) ? 255 : 275,
      },
    ];

    const copperCable220 = [
      {
        section: 2.5,
        text: (earthType) ? "3x2.5мм.кв" : "2x2.5мм.кв",
        allowCurrent: (earthType) ? 25 : 27,
      },
      {
        section: 4,
        text: (earthType) ? "3x4мм.кв" : "2x4мм.кв",
        allowCurrent: (earthType) ? 35 : 38,
      },
      {
        section: 6,
        text: (earthType) ? "3x6мм.кв" : "2x6мм.кв",
        allowCurrent: (earthType) ? 42 : 50,
      },
      {
        section: 10,
        text: (earthType) ? "3x10мм.кв" : "2x10мм.кв",
        allowCurrent: (earthType) ? 55 : 70,
      },
      {
        section: 16,
        text: (earthType) ? "3x16мм.кв" : "2x16мм.кв",
        allowCurrent: (earthType) ? 75 : 90,
      },
      {
        section: 25,
        text: (earthType) ? "3x25мм.кв" : "2x25мм.кв",
        allowCurrent: (earthType) ? 95 : 115,
      },
      {
        section: 35,
        text: (earthType) ? "3x35мм.кв" : "2x35мм.кв",
        allowCurrent: (earthType) ? 120 : 140,
      },
      {
        section: 50,
        text: (earthType) ? "3x50мм.кв" : "2x50мм.кв",
        allowCurrent: (earthType) ? 145 : 175,
      },
      {
        section: 70,
        text: (earthType) ? "3x70мм.кв" : "2x70мм.кв",
        allowCurrent: (earthType) ? 180 : 215,
      },
      {
        section: 95,
        text: (earthType) ? "3x95мм.кв" : "2x95мм.кв",
        allowCurrent: (earthType) ? 220 : 260,
      },
      {
        section: 120,
        text: (earthType) ? "3x120мм.кв" : "2x120мм.кв",
        allowCurrent: (earthType) ? 300 : 260,
      },
      {
        section: 150,
        text: (earthType) ? "3x150мм.кв" : "2x150мм.кв",
        allowCurrent: (earthType) ? 305 : 350,
      },
    ];

    const copperWire220 = [
      {
        section: 2.5,
        text: (earthType) ? "3x(1x2.5)мм.кв" : "2x(1x2.5)мм.кв",
        allowCurrent: (earthType) ? 25 : 27,
      },
      {
        section: 4,
        text: (earthType) ? "3x(1x4)мм.кв" : "2x(1x4)мм.кв",
        allowCurrent: (earthType) ? 35 : 38,
      },
      {
        section: 6,
        text: (earthType) ? "3x(1x6)мм.кв" : "2x(1x6)мм.кв",
        allowCurrent: (earthType) ? 42 : 46,
      },
      {
        section: 10,
        text: (earthType) ? "3x(1x10)мм.кв" : "2x(1x10)мм.кв",
        allowCurrent: (earthType) ? 60 : 70,
      },
      {
        section: 16,
        text: (earthType) ? "3x(1x16)мм.кв" : "2x(1x16)мм.кв",
        allowCurrent: (earthType) ? 80 : 85,
      },
      {
        section: 25,
        text: (earthType) ? "3x(1x25)мм.кв" : "2x(1x25)мм.кв",
        allowCurrent: (earthType) ? 100 : 115,
      },
      {
        section: 35,
        text: (earthType) ? "3x(1x35)мм.кв" : "2x(1x35)мм.кв",
        allowCurrent: (earthType) ? 125 : 135,
      },
      {
        section: 50,
        text: (earthType) ? "3x(1x50)мм.кв" : "2x(1x50)мм.кв",
        allowCurrent: (earthType) ? 170 : 185,
      },
      {
        section: 70,
        text: (earthType) ? "3x(1x70)мм.кв" : "2x(1x70)мм.кв",
        allowCurrent: (earthType) ? 210 : 225,
      },
      {
        section: 95,
        text: (earthType) ? "3x(1x95)мм.кв" : "2x(1x95)мм.кв",
        allowCurrent: (earthType) ? 255 : 275,
      },
      {
        section: 120,
        text: (earthType) ? "3x(1x120)мм.кв" : "2x(1x120)мм.кв",
        allowCurrent: (earthType) ? 290 : 315,
      },
      {
        section: 150,
        text: (earthType) ? "3x(1x150)мм.кв" : "2x(1x150)мм.кв",
        allowCurrent: (earthType) ? 330 : 360,
      },
    ];

    // 380B ...
    const aluminumCable380 = [
      {
        section: 2.5,
        text: (earthType) ? "5x2.5мм.кв" : "4x2.5мм.кв",
        allowCurrent: (earthType) ? 17 : 17,
      },
      {
        section: 4,
        text: (earthType) ? "5x4мм.кв" : "4x4мм.кв",
        allowCurrent: (earthType) ? 24 : 24,
      },
      {
        section: 6,
        text: (earthType) ? "5x6мм.кв" : "4x6мм.кв",
        allowCurrent: (earthType) ? 29 : 29,
      },
      {
        section: 10,
        text: (earthType) ? "5x10мм.кв" : "4x10мм.кв",
        allowCurrent: (earthType) ? 38 : 38,
      },
      {
        section: 16,
        text: (earthType) ? "5x16мм.кв" : "4x16мм.кв",
        allowCurrent: (earthType) ? 54 : 54,
      },
      {
        section: 25,
        text: (earthType) ? "4x25+1x16мм.кв" : "3x25+1x16мм.кв",
        allowCurrent: (earthType) ? 68 : 68,
      },
      {
        section: 35,
        text: (earthType) ? "4x35+1x25мм.кв" : "3x35+1x25мм.кв",
        allowCurrent: (earthType) ? 81 : 81,
      },
      {
        section: 50,
        text: (earthType) ? "4x50+1x25мм.кв" : "3x50+1x25мм.кв",
        allowCurrent: (earthType) ? 100 : 100,
      },
      {
        section: 70,
        text: (earthType) ? "4x70+1x35мм.кв" : "3x70+1x35мм.кв",
        allowCurrent: (earthType) ? 126 : 126,
      },
      {
        section: 95,
        text: (earthType) ? "4x95+1x50мм.кв" : "3x95+1x50мм.кв",
        allowCurrent: (earthType) ? 153 : 153,
      },
      {
        section: 120,
        text: (earthType) ? "4x120+1x70мм.кв" : "3x120+1x70мм.кв",
        allowCurrent: (earthType) ? 190 : 190,
      },
      {
        section: 150,
        text: (earthType) ? "4x150+1x95мм.кв" : "3x150+1x95мм.кв",
        allowCurrent: (earthType) ? 212 : 212,
      },
      {
        section: 185,
        text: (earthType) ? "4x185+1x95мм.кв" : "3x185+1x95мм.кв",
        allowCurrent: (earthType) ? 241 : 241,
      },
      {
        section: 240,
        text: (earthType) ? "4x240+1x120мм.кв" : "3x240+1x120мм.кв",
        allowCurrent: (earthType) ? 274 : 274,
      },
    ];

    const copperCable380 = [
      {
        section: 2.5,
        text: (earthType) ? "5x2.5мм.кв" : "4x2.5мм.кв",
        allowCurrent: (earthType) ? 22 : 22,
      },
      {
        section: 4,
        text: (earthType) ? "5x4мм.кв" : "4x4мм.кв",
        allowCurrent: (earthType) ? 31 : 31,
      },
      {
        section: 6,
        text: (earthType) ? "5x6мм.кв" : "4x6мм.кв",
        allowCurrent: (earthType) ? 38 : 38,
      },
      {
        section: 10,
        text: (earthType) ? "5x10мм.кв" : "4x10мм.кв",
        allowCurrent: (earthType) ? 50 : 50,
      },
      {
        section: 16,
        text: (earthType) ? "5x16мм.кв" : "4x16мм.кв",
        allowCurrent: (earthType) ? 68 : 68,
      },
      {
        section: 25,
        text: (earthType) ? "4x25+1x16мм.кв" : "3x25+1x16мм.кв",
        allowCurrent: (earthType) ? 85 : 85,
      },
      {
        section: 35,
        text: (earthType) ? "4x35+1x25мм.кв" : "3x35+1x25мм.кв",
        allowCurrent: (earthType) ? 108 : 108,
      },
      {
        section: 50,
        text: (earthType) ? "4x50+1x25мм.кв" : "3x50+1x25мм.кв",
        allowCurrent: (earthType) ? 130 : 130,
      },
      {
        section: 70,
        text: (earthType) ? "4x70+1x35мм.кв" : "3x70+1x35мм.кв",
        allowCurrent: (earthType) ? 162 : 162,
      },
      {
        section: 95,
        text: (earthType) ? "4x95+1x50мм.кв" : "3x95+1x50мм.кв",
        allowCurrent: (earthType) ? 200 : 200,
      },
      {
        section: 120,
        text: (earthType) ? "4x120+1x70мм.кв" : "3x120+1x70мм.кв",
        allowCurrent: (earthType) ? 234 : 234,
      },
      {
        section: 150,
        text: (earthType) ? "4x150+1x95мм.кв" : "3x150+1x95мм.кв",
        allowCurrent: (earthType) ? 275 : 275,
      },
      {
        section: 185,
        text: (earthType) ? "4x185+1x95мм.кв" : "3x185+1x95мм.кв",
        allowCurrent: (earthType) ? 308 : 308,
      },
      {
        section: 240,
        text: (earthType) ? "4x240+1x120мм.кв" : "3x240+1x120мм.кв",
        allowCurrent: (earthType) ? 355 : 355,
      },
    ];

    const aluminumWire380 = [
      {
        section: 2.5,
        text: (earthType) ? "5x(1x2.5)мм.кв" : "4x(1x2.5)мм.кв",
        allowCurrent: (earthType) ? 15 : 19,
      },
      {
        section: 4,
        text: (earthType) ? "5x(1x4)мм.кв" : "4x(1x4)мм.кв",
        allowCurrent: (earthType) ? 22 : 23,
      },
      {
        section: 6,
        text: (earthType) ? "5x(1x6)мм.кв" : "4x(1x6)мм.кв",
        allowCurrent: (earthType) ? 26 : 30,
      },
      {
        section: 10,
        text: (earthType) ? "5x(1x10)мм.кв" : "4x(1x10)мм.кв",
        allowCurrent: (earthType) ? 38 : 39,
      },
      {
        section: 16,
        text: (earthType) ? "5x(1x16)мм.кв" : "4x(1x16)мм.кв",
        allowCurrent: (earthType) ? 48 : 55,
      },
      {
        section: 25,
        text:
          (earthType)
            ? "4x(1x25)+(1x16)мм.кв"
            : "3x(1x25)+(1x16)мм.кв",
        allowCurrent: (earthType) ? 65 : 70,
      },
      {
        section: 35,
        text:
          (earthType)
            ? "4x(1x35)+(1x25)мм.кв"
            : "3x(1x35)+(1x25)мм.кв",
        allowCurrent: (earthType) ? 75 : 85,
      },
      {
        section: 50,
        text:
          (earthType)
            ? "4x(1x50)+(1x25)мм.кв"
            : "3x(1x50)+(1x25)мм.кв",
        allowCurrent: (earthType) ? 105 : 120,
      },
      {
        section: 70,
        text:
          (earthType)
            ? "4x(1x70)+(1x35)мм.кв"
            : "3x(1x70)+(1x35)мм.кв",
        allowCurrent: (earthType) ? 130 : 140,
      },
      {
        section: 95,
        text:
          (earthType)
            ? "4x(1x95)+(1x50)мм.кв"
            : "3x(1x95)+(1x50)мм.кв",
        allowCurrent: (earthType) ? 175 : 175,
      },
      {
        section: 120,
        text:
          (earthType)
            ? "4x(1x120)+(1x70)мм.кв"
            : "3x(1x120)+(1x70)мм.кв",
        allowCurrent: (earthType) ? 200 : 200,
      },
    ];

    const copperWire380 = [
      {
        section: 2.5,
        text: (earthType) ? "5x(1x2.5)мм.кв" : "4x(1x2.5)мм.кв",
        allowCurrent: (earthType) ? 20 : 25,
      },
      {
        section: 4,
        text: (earthType) ? "5x(1x4)мм.кв" : "4x(1x4)мм.кв",
        allowCurrent: (earthType) ? 28 : 30,
      },
      {
        section: 6,
        text: (earthType) ? "5x(1x6)мм.кв" : "4x(1x6)мм.кв",
        allowCurrent: (earthType) ? 34 : 40,
      },
      {
        section: 10,
        text: (earthType) ? "5x(1x10)мм.кв" : "4x(1x10)мм.кв",
        allowCurrent: (earthType) ? 48 : 50,
      },
      {
        section: 16,
        text: (earthType) ? "5x(1x16)мм.кв" : "4x(1x16)мм.кв",
        allowCurrent: (earthType) ? 64 : 75,
      },
      {
        section: 25,
        text:
          (earthType)
            ? "4x(1x25)+(1x16)мм.кв"
            : "3x(1x25)+(1x16)мм.кв",
        allowCurrent: (earthType) ? 80 : 90,
      },
      {
        section: 35,
        text:
          (earthType)
            ? "4x(1x35)+(1x25)мм.кв"
            : "3x(1x35)+(1x25)мм.кв",
        allowCurrent: (earthType) ? 100 : 115,
      },
      {
        section: 50,
        text:
          (earthType)
            ? "4x(1x50)+(1x25)мм.кв"
            : "3x(1x50)+(1x25)мм.кв",
        allowCurrent: (earthType) ? 135 : 150,
      },
      {
        section: 70,
        text:
          (earthType)
            ? "4x(1x70)+(1x35)мм.кв"
            : "3x(1x70)+(1x35)мм.кв",
        allowCurrent: (earthType) ? 165 : 185,
      },
      {
        section: 95,
        text:
          (earthType)
            ? "4x(1x95)+(1x50)мм.кв"
            : "3x(1x95)+(1x50)мм.кв",
        allowCurrent: (earthType) ? 255 : 255,
      },
      {
        section: 120,
        text:
          (earthType)
            ? "4x(1x120)+(1x70)мм.кв"
            : "3x(1x120)+(1x70)мм.кв",
        allowCurrent: (earthType) ? 260 : 260,
      },
      {
        section: 150,
        text:
          (earthType)
            ? "4x(1x150)+(1x95)мм.кв"
            : "3x(1x150)+(1x95)мм.кв",
        allowCurrent: (earthType) ? 300 : 300,
      },
      {
        section: 185,
        text:
          (earthType)
            ? "4x(1x185)+(1x95)мм.кв"
            : "3x(1x185)+(1x95)мм.кв",
        allowCurrent: (earthType) ? 346 : 346,
      },
      {
        section: 240,
        text:
          (earthType)
            ? "4x(1x240)+(1x120)мм.кв"
            : "3x(1x240)+(1x120)мм.кв",
        allowCurrent: (earthType) ? 397 : 397,
      },
    ];

    const objArr = (
      currentCB: number,
      arr: { section: number; text: string; allowCurrent: number }[]
    ) => {
      for (const e of arr) {
        if (e.allowCurrent < currentCB) continue;
        return e;
      }
    };

    const type = () => {
      if (onePhase) {
        if (conductorType === "AC")
          return objArr(circuitBreakerCurrent, aluminumCable220);
        if (conductorType === "AW")
          return objArr(circuitBreakerCurrent, aluminumWire220);
        if (conductorType === "CC")
          return objArr(circuitBreakerCurrent, copperCable220);
        if (conductorType === "CW")
          return objArr(circuitBreakerCurrent, copperWire220);
      } else {
        if (conductorType === "AC")
          return objArr(circuitBreakerCurrent, aluminumCable380);
        if (conductorType === "AW")
          return objArr(circuitBreakerCurrent, aluminumWire380);
        if (conductorType === "CC")
          return objArr(circuitBreakerCurrent, copperCable380);
        if (conductorType === "CW")
          return objArr(circuitBreakerCurrent, copperWire380);
      }
    };

    const sectionObj = type();
    console.log("Буцаж ирж байгаа утгаа шалгая: ", sectionObj);

    return sectionObj
      ? sectionObj
      : "Нэг хэлхээгээр дамжуулахад ачаалал харьцангуй их байгаа тул, ачааллыг хоёр хувааж дамжуулахаар төлөвлөх нь илүү тохиромжтой!";
  };

  // Сантехникийн ачааг cosф-д тааруулж ангилах функц...
  const classifyPlumbLoad: ClassifyPlumbLoad = (loads: number[]) => {
    const lessOne = loads.filter((el) => el < 1);
    const oneToFour = loads.filter((el) => el >= 1 && el <= 4);
    const moreThanFour = loads.filter((el) => el > 4);

    return { lessOne, oneToFour, moreThanFour };
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

    return largeValue !== 0
      ? largeValue
      : "Хэт урт шугам, эсвэл хэт их ачаалалтайгаас хамаараад шаардлага хангах утгыг сонгох боломжгүй...";
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

  // "C" коэффициент өгөх функц ...
  const giveC: GiveC = (material, onePhase) => {
    let c = 77;
    if (onePhase) {
      if (material === "AC" || material === "AW") c = 7.7;
      else if (material === "CC" || material === "CW") c = 12.8;
    } else {
      if (material === "AC" || material === "AW") c = 46;
      else c = 77;
    }

    return c;
  };

  return (
    <CalcContext.Provider
      value={{
        currentThreePhase,
        voltageDrop,
        circuitBreaker,
        apartmentCalc,
        conductor,
        calcPlumb,
        elevatorCalc,
        interpolation,
        ptbCalc,
        currentOnePhase,
        equilentPowerFactor,
        classifyPlumbLoad,
      }}
    >
      {children}
    </CalcContext.Provider>
  );
};

export default CalcContext;
