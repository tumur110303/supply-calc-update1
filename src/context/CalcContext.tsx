import { FC, createContext } from "react";

const CalcContext = createContext<{
  upperValue: UpperValue;
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
  sectionFromDrop: SectionFromDrop;
  contactorRelay: Contactor;
  stringifySection: StringifySection;
} | null>(null);

type EquilentPowerFactor = (loads: number[], pf: number[]) => number;

type PtbCalc = (capacity: number, transformerNumber: 1 | 2) => string;
type StringifySection = (
  section: number,
  conductorType: "CW" | "CC" | "AW" | "AC",
  earthType?: boolean,
  onePhase?: boolean
) => string;

type CalcPlumb = (quantity: number, load: number) => number;
type Interpolation = (
  userValue: number,
  key: number[],
  value: number[]
) => number;
type ElevatorCalc = (
  quantity: number,
  load: number,
  moreThanFloor?: boolean
) => number;

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
  earthType?: boolean,
  onePhase?: boolean
) => number;
type GetLargeValue = (value: number, arr: number[]) => number[];
type ApartmentCalc = (numberApartment: number) => number;
type ClassifyPlumbLoad = (loads: number[]) => object;
type CurrentThreePhase = (
  load: number,
  powerFactor: number,
  delta?: boolean,
  mainUnit?: boolean
) => number;
type VoltageDrop = (
  load: number,
  length: number,
  section:
    | 2.5
    | 4
    | 6
    | 10
    | 16
    | 25
    | 35
    | 50
    | 70
    | 95
    | 120
    | 150
    | 185
    | 240,
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
type Contactor = (current: number) => number[];
type UpperValue = (value1: number, value2: number) => number;

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
  // Хөндлөн огтлолын стандарт тавилууд...
  const sectionTabs = [
    2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240,
  ];

  // ##########################  ТООЦООНЫ ФУНКЦУУД ... ###############################
  // 01. Дэд станц сонгох...
  const ptbCalc = (capacity: number, transformerNumber: 1 | 2) => {
    const powerTableTp = [
      10, 25, 40, 63, 100, 160, 250, 320, 400, 500, 630, 800, 1000, 1600, 2500,
      4000, 6300, 10000, 16000, 25000, 40000,
    ];

    const tpPower = getLargeValue(
      transformerNumber === 1 ? Math.abs(capacity) : Math.abs(capacity) / 1.4,
      powerTableTp
    )[0];

    const stringValue =
      tpPower !== 0
        ? `${transformerNumber}x${tpPower} кВА чадалтай дэд станц`
        : "Sн=40МВА-аас илүү чадалтай дэд станц";

    return capacity === 0 ? "Өгөгдлөө гүйцэд оруулна уу!" : stringValue;
  };

  // 02. Сууцны ачаалал тодорхойлох функц ...
  const apartmentCalc = (numberApartment: number) => {
    const privLoad = interpolation(
      Math.abs(numberApartment),
      numberTabAppartment,
      privLoadTab
    );
    const apartmentLoad = Math.abs(numberApartment) * privLoad;
    return numberApartment === 0 ? 0 : apartmentLoad;
  };

  // 03. Сангийн ачаалал тодорхойлох функц...
  const calcPlumb = (quantity: number, totalLoad: number) => {
    let coeff: number = 0;
    if (quantity === 3) coeff = 0.9;
    else if (quantity === 200) coeff = 0.5;
    if (quantity > 3 && quantity < 200)
      coeff = interpolation(quantity, numberTabPlumb, coefficientPlumbTab);
    if (quantity < 3) coeff = 1;
    if (quantity > 200) coeff = 0.5;

    const plumbLoad = Math.abs(totalLoad) * coeff;

    return quantity <= 0 || totalLoad === 0 ? 0 : plumbLoad;
  };

  // 04. Лифтний ачаалал тодорхойлох функцууд...
  const elevatorCalc: ElevatorCalc = (quantity, totalLoad, moreThanFloor) => {
    let coeffElevator = 0;

    if (moreThanFloor) {
      if (quantity == 1) coeffElevator = 1;
      else if (quantity < 4) coeffElevator = 0.9;
      else if (quantity < 6) coeffElevator = 0.8;
      else if (quantity === 6) coeffElevator = 0.75;
      else if (quantity > 6 && quantity < 10) {
        coeffElevator = interpolation(
          quantity,
          numberElevatorTab,
          moreThanTwelve
        );
      } else if (quantity == 10) coeffElevator = 0.6;
      else if (quantity > 10 && quantity < 20) {
        coeffElevator = interpolation(
          quantity,
          numberElevatorTab,
          moreThanTwelve
        );
      } else if (quantity == 20) coeffElevator = 0.5;
      else if (quantity > 20 && quantity < 26) {
        coeffElevator = interpolation(
          quantity,
          numberElevatorTab,
          moreThanTwelve
        );
      } else coeffElevator = 0.4;
    } else {
      if (quantity == 1) coeffElevator = 1;
      else if (quantity < 4) coeffElevator = 0.8;
      else if (quantity < 6) coeffElevator = 0.7;
      else if (quantity == 6) coeffElevator = 0.65;
      else if (quantity > 6 && quantity < 10) {
        coeffElevator = interpolation(
          quantity,
          numberElevatorTab,
          lessThanTwelve
        );
      } else if (quantity == 10) coeffElevator = 0.5;
      else if (quantity > 10 && quantity < 20) {
        coeffElevator = interpolation(
          quantity,
          numberElevatorTab,
          lessThanTwelve
        );
      } else if (quantity == 20) coeffElevator = 0.4;
      else if (quantity > 20 && quantity < 26) {
        coeffElevator = interpolation(
          quantity,
          numberElevatorTab,
          lessThanTwelve
        );
      } else coeffElevator = 0.35;
    }

    const elevatorLoad = totalLoad * coeffElevator;
    return totalLoad === 0 || quantity <= 0 ? 0 : elevatorLoad;
  };

  // 05. Дундаж чадлын коэффициент...
  const equilentPowerFactor: EquilentPowerFactor = (loads, pf) => {
    if (loads.length !== pf.length) return 0;

    let wrongValue: boolean = false;

    pf.map((el) => {
      if (el < 0 || el > 1) wrongValue = true;
    });

    const nemegdehuun = loads.map((el, i) => el * pf[i]);

    const hurtwer: number = nemegdehuun.reduce((a, b) => a + b);
    const huwaari: number = loads.reduce((a, b) => a + b);

    const powerFactor = hurtwer / huwaari;

    return wrongValue ? 0 : powerFactor;
  };

  // #########################  Засвартай...   #####################

  // 06. Гүйдэл тооцох 220B ...
  const currentOnePhase: CurrentOnePhase = (
    loadParameter,
    powerFactor,
    mainUnit
  ) => {
    let huwaari = 0;
    let current = 0;

    const load = Math.abs(loadParameter);

    if (mainUnit) {
      huwaari = 220 * powerFactor;
      current = load / huwaari;
    } else {
      huwaari = 220 * powerFactor;
      current = (1000 * load) / huwaari;
    }
    return powerFactor > 1 || powerFactor < 0 ? 0 : current;
  };

  // 07. Гүйдэл тооцох 380B ...
  const currentThreePhase: CurrentThreePhase = (
    loadParameter,
    powerFactor,
    delta,
    mainUnit
  ) => {
    let huwaari = 0;
    let current = 0;
    const threeSquart = Math.sqrt(3);
    const load = Math.abs(loadParameter);

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
    return powerFactor > 1 || powerFactor < 0 ? 0 : current;
  };

  // 08. Хүчдэлийн алдагдал тооцох 380В...
  const voltageDrop: VoltageDrop = (
    loadParameter,
    lengthParameter,
    section,
    material,
    onePhase
  ) => {
    const load = Math.abs(loadParameter);
    const length = Math.abs(lengthParameter);
    const c = giveC(material, onePhase);
    const hurtwer = load * length;
    const huwaari = c * section;
    const drop = hurtwer / huwaari;

    return drop;
  };

  // 09. Автомат сонгох 220/380В ...
  const circuitBreaker: CircuitBreaker = (curr) => {
    const current = Math.abs(curr);
    const circBreaker = [
      16, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 355, 400, 500,
      630, 800, 1000, 1600, 2000,
    ];

    const circuitBreakerCurrent =
      getLargeValue(current * 1.15, circBreaker)[0] !== -1
        ? getLargeValue(current * 1.15, circBreaker)[0]
        : 0;

    return circuitBreakerCurrent;
  };

  // 10. Сантехникийн ачааг cosф-д тааруулж ангилах функц...
  const classifyPlumbLoad: ClassifyPlumbLoad = (loads: number[]) => {
    const lessOne = loads.filter((el) => el < 1);
    const oneToFour = loads.filter((el) => el >= 1 && el <= 4);
    const moreThanFour = loads.filter((el) => el > 4);

    return { lessOne, oneToFour, moreThanFour };
  };

  // 11. Контакторын гүйдэл тооцох...
  const contactorRelay: Contactor = (curr) => {
    const current = Math.abs(curr);

    const contactorTable = [
      9, 12, 18, 25, 32, 40, 50, 65, 80, 95, 115, 150, 185, 225, 265, 330,
    ];

    const contactor = getLargeValue(current, contactorTable)[0];
    const termoRelay = Math.ceil(1.05 * current);
    return [contactor, termoRelay];
  };

  // ############################## ДАМЖУУЛАГЧ ###############################
  // 12. Халалтын нөхцлөөр хөндлөн огтлол сонгох...
  const conductor: Conductor = (
    circuitBreakerCurrent,
    conductorType,
    earthType,
    onePhase
  ) => {
    let arrCurrent: number[] = [];
    // 380B кабелиуд...
    const aluminumCable380 = [
      17, 24, 29, 38, 54, 68, 81, 100, 126, 153, 190, 212, 241, 274,
    ];

    const copperCable380 = [
      22, 31, 38, 50, 68, 85, 108, 130, 162, 200, 234, 275, 308, 355,
    ];

    // 380B утаснууд ...
    const copperWire380 = [
      earthType ? 20 : 25,
      earthType ? 28 : 30,
      earthType ? 34 : 40,
      earthType ? 48 : 50,
      earthType ? 64 : 75,
      earthType ? 80 : 90,
      earthType ? 100 : 115,
      earthType ? 135 : 150,
      earthType ? 165 : 185,
      earthType ? 255 : 255,
      earthType ? 260 : 260,
      earthType ? 300 : 300,
      earthType ? 346 : 346,
      earthType ? 397 : 397,
    ];

    const aluminumWire380 = [
      earthType ? 15 : 19,
      earthType ? 22 : 23,
      earthType ? 26 : 30,
      earthType ? 38 : 39,
      earthType ? 48 : 55,
      earthType ? 65 : 70,
      earthType ? 75 : 85,
      earthType ? 105 : 120,
      earthType ? 130 : 140,
      earthType ? 175 : 175,
      earthType ? 200 : 200,
      212,
      241,
      274,
    ];

    // 220B кабель...
    const aluminumCable220 = [
      earthType ? 19 : 21,
      earthType ? 27 : 29,
      earthType ? 32 : 38,
      earthType ? 42 : 55,
      earthType ? 60 : 70,
      earthType ? 75 : 90,
      earthType ? 90 : 105,
      earthType ? 110 : 135,
      earthType ? 140 : 165,
      earthType ? 170 : 200,
      earthType ? 200 : 230,
      earthType ? 235 : 270,
    ];

    const copperCable220 = [
      earthType ? 25 : 27,
      earthType ? 35 : 38,
      earthType ? 42 : 50,
      earthType ? 55 : 70,
      earthType ? 75 : 90,
      earthType ? 95 : 115,
      earthType ? 120 : 140,
      earthType ? 145 : 175,
      earthType ? 180 : 215,
      earthType ? 220 : 260,
      earthType ? 300 : 260,
      earthType ? 305 : 350,
    ];

    // 220B утас...
    const aluminumWire220 = [
      earthType ? 19 : 20,
      28,
      earthType ? 32 : 36,
      earthType ? 47 : 50,
      60,
      earthType ? 80 : 85,
      earthType ? 95 : 100,
      earthType ? 130 : 140,
      earthType ? 165 : 175,
      earthType ? 200 : 215,
      earthType ? 220 : 245,
      earthType ? 255 : 275,
    ];

    const copperWire220 = [
      earthType ? 25 : 27,
      earthType ? 35 : 38,
      earthType ? 42 : 46,
      earthType ? 60 : 70,
      earthType ? 80 : 85,
      earthType ? 100 : 115,
      earthType ? 125 : 135,
      earthType ? 170 : 185,
      earthType ? 210 : 225,
      earthType ? 255 : 275,
      earthType ? 290 : 315,
      earthType ? 330 : 360,
    ];

    if (!onePhase) {
      if (conductorType === "AC") arrCurrent = aluminumCable380;
      else if (conductorType === "CC") arrCurrent = copperCable380;
      else if (conductorType === "AW") arrCurrent = aluminumWire380;
      else if (conductorType === "CW") arrCurrent = copperWire380;
    } else {
      if (conductorType === "AC") arrCurrent = aluminumCable220;
      else if (conductorType === "CC") arrCurrent = copperCable220;
      else if (conductorType === "AW") arrCurrent = aluminumWire220;
      else if (conductorType === "CW") arrCurrent = copperWire220;
    }

    const index = getLargeValue(circuitBreakerCurrent, arrCurrent)[1];
    const section = index !== -1 ? sectionTabs[index] : 0;

    return section;
  };

  // 13. Хүчдэлийн алдагдлаар хөндлөн огтлол сонгох...
  const sectionFromDrop: SectionFromDrop = (
    load,
    length,
    allowDrop,
    material,
    onePhase
  ) => {
    const c = giveC(material, onePhase);
    const hurtwer = load * length;
    const huwaari = c * allowDrop;
    const real = hurtwer / huwaari;

    const sectionDrop = getLargeValue(real, sectionTabs)[0];

    return sectionDrop;
  };

  // 14. 2 тооны аль ихийг өгөх функц...
  const upperValue: UpperValue = (value1, value2) => {
    return value1 === 0 || value2 === 0 ? 0 : value1 > value2 ? value1 : value2;
  };

  // 15. Хөндлөн огтлолыг string рүү хөрвүүлэх функц...
  const stringifySection: StringifySection = (
    section,
    conductorType,
    earthType,
    onePhase
  ) => {
    let sectionString: string[] = [];
    // 220B ...
    const wire220 = [
      earthType ? "3x(1x2.5) " : "2x(1x2.5) ",
      earthType ? "3x(1x4) " : "2x(1x4) ",
      earthType ? "3x(1x6) " : "2x(1x6) ",
      earthType ? "3x(1x10) " : "2x(1x10) ",
      earthType ? "3x(1x16) " : "2x(1x16) ",
      earthType ? "3x(1x25) " : "2x(1x25) ",
      earthType ? "3x(1x35) " : "2x(1x35) ",
      earthType ? "3x(1x50) " : "2x(1x50) ",
      earthType ? "3x(1x70) " : "2x(1x70) ",
      earthType ? "3x(1x95) " : "2x(1x95) ",
      earthType ? "3x(1x120) " : "2x(1x120) ",
      earthType ? "3x(1x150) " : "2x(1x150) ",
      earthType ? "3x(1x185) " : "2x(1x185) ",
      earthType ? "3x(1x240) " : "2x(1x240) ",
    ];

    const cable220 = [
      earthType ? "3x2.5 " : "2x2.5 ",
      earthType ? "3x4 " : "2x4 ",
      earthType ? "3x6 " : "2x6 ",
      earthType ? "3x10 " : "2x10 ",
      earthType ? "3x16 " : "2x16 ",
      earthType ? "3x25 " : "2x25 ",
      earthType ? "3x35 " : "2x35 ",
      earthType ? "3x50 " : "2x50 ",
      earthType ? "3x70 " : "2x70 ",
      earthType ? "3x95 " : "2x95 ",
      earthType ? "3x120 " : "2x120 ",
      earthType ? "3x150 " : "2x150 ",
      earthType ? "3x185 " : "2x185 ",
      earthType ? "3x240 " : "2x240 ",
    ];

    // 380B ...
    const cable380 = [
      earthType ? "5x2.5 " : "4x2.5 ",
      earthType ? "5x4 " : "4x4 ",
      earthType ? "5x6 " : "4x6 ",
      earthType ? "5x10 " : "4x10 ",
      earthType ? "5x16 " : "4x16 ",
      earthType ? "4x25+1x16 " : "3x25+1x16 ",
      earthType ? "4x35+1x25 " : "3x35+1x25 ",
      earthType ? "4x50+1x25 " : "3x50+1x25 ",
      earthType ? "4x70+1x35 " : "3x70+1x35 ",
      earthType ? "4x95+1x50 " : "3x95+1x50 ",
      earthType ? "4x120+1x70 " : "3x120+1x70 ",
      earthType ? "4x150+1x95 " : "3x150+1x95 ",
      earthType ? "4x185+1x95 " : "3x185+1x95 ",
      earthType ? "4x240+1x120 " : "3x240+1x120 ",
    ];

    const wire380 = [
      earthType ? "5x(1x2.5) " : "4x(1x2.5) ",
      earthType ? "5x(1x4) " : "4x(1x4) ",
      earthType ? "5x(1x6) " : "4x(1x6) ",
      earthType ? "5x(1x10) " : "4x(1x10) ",
      earthType ? "5x(1x16) " : "4x(1x16) ",
      earthType ? "4x(1x25)+(1x16) " : "3x(1x25)+(1x16) ",
      earthType ? "4x(1x35)+(1x25) " : "3x(1x35)+(1x25) ",
      earthType ? "4x(1x50)+(1x25) " : "3x(1x50)+(1x25) ",
      earthType ? "4x(1x70)+(1x35) " : "3x(1x70)+(1x35) ",
      earthType ? "4x(1x95)+(1x50) " : "3x(1x95)+(1x50) ",
      earthType ? "4x(1x120)+(1x70) " : "3x(1x120)+(1x70) ",
      earthType ? "4x(1x150)+(1x95) " : "3x(1x150)+(1x95) ",
      earthType ? "4x(1x185)+(1x95) " : "3x(1x185)+(1x95) ",
      earthType ? "4x(1x240)+(1x120) " : "3x(1x240)+(1x120) ",
    ];

    const i = getEqualValue(section, sectionTabs)[1];

    if (onePhase) {
      sectionString =
        conductorType === "AC" || conductorType === "CC" ? cable220 : wire220;
    } else {
      sectionString =
        conductorType === "AC" || conductorType === "CC" ? cable380 : wire380;
    }

    return section === 0 || i === -1
      ? "Хэт их ачаалал юм уу хэт урт шугамаас болоод тохирох огтлол байхгүй! Иймээс ачааллыг хувааж дамжуулна уу!"
      : sectionString[i];
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

    const i = largeValue !== 0 ? arr.indexOf(largeValue) : -1;

    return largeValue === 0 || i === -1 ? [0, i] : [largeValue, i];
  };

  // ТАБЛИЦТАЙ ТЭНЦҮҮЛЖ АВАХ ФУНКЦ ...
  const getEqualValue: GetLargeValue = (value, arr) => {
    let equalValue = 0;

    for (const e of arr) {
      if (e !== value) continue;
      equalValue = e;
      break;
    }

    const i = equalValue !== 0 ? arr.indexOf(equalValue) : -1;

    return equalValue !== 0 || i !== -1 ? [equalValue, i] : [0, i];
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
        upperValue,
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
        sectionFromDrop,
        contactorRelay,
        stringifySection,
      }}
    >
      {children}
    </CalcContext.Provider>
  );
};

export default CalcContext;
