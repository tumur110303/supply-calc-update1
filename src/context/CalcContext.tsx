import { FC, createContext } from "react";

const CalcContext = createContext<{
  calcPlumbCoeff: CalcPlumbCoeff;
  elevatorCoeff: ElevatorCoeff;
  currentCalc: CurrentCalc;
  interpolation: Interpolation;
  currentOneEquipmentThreePhase: CurrentOneEquipment;
  currentOneEquipmentOnePhase: CurrentOneEquipment;
  wireCircuitBreakerThreePhase: WireCircuitBreakerThreePhase;
  ptbCalc: PtbCalc;
  equilentPowerFactor: EquilentPowerFactor;
} | null>(null);

type WireCircuitBreakerThreePhase = (
  cableType: string,
  current: number,
  bodsonOgtlol?: number
) => {
  circuitBreakerCurrent: number;
  realSection: number;
  wireCable: string;
};

type CurrentOneEquipment = (
  load: number,
  pf: number,
  cableType: string,
  acceptVoltage: number,
  length: number,
  starConnect?: null | boolean
) => {
  current: number;
  circuitBreakerCurrent: number;
  realVoltageDrop: number;
  wireCable: string;
};

type VoltageDrop = (
  load: number,
  acceptVoltage: number,
  length: number,
  cableType: string
) => number;

type EquilentPowerFactor = (loads: number[], pfs: number[]) => number;

type CableSizer = (cable: number[]) => any;

type BodsonCableProcess = (bodson?: number, table?: number[]) => any;

type SectionCalcThreePhase = (
  section?: number | null,
  cableType?: string
) => string;

type PtbCalc = (capacity: number, transformerNumber: number) => string;

type CurrentCalc = (
  power: number,
  load: number[],
  pfactor: number[],
  cableType: string
) => {
  current: number;
  burenChadal: number;
  powerFactor: number;
  circuitBreakerCurrent: number;
  wireCable: string;
};
type CalcPlumbCoeff = (value: number) => number;
type Interpolation = (
  userValue: number,
  key: number[],
  value: number[]
) => number;
type ElevatorCoeff = (value: number, twelveFloor: boolean) => number;

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

  // 220B автомат, утасны хөндлөн огтлол буцаах гол функц...
  const wireCircuitBreakerOnePhase: WireCircuitBreakerThreePhase = (
    cableType,
    current,
    bodsonOgtlol
  ) => {
    let wireCable = "";
    let wireCableSize = 0;
    let circuitBreakerCurrent = 0;

    const circBreaker = [16, 25, 32, 40, 50, 63, 80, 100, 125, 160];
    const sectionCable = [2.5, 4, 6, 10, 16, 25, 35, 50, 70];

    const alumBronCurr = [28, 37, 44, 59, 77, 102, 123, 143, 178];
    const alumCurr = [21, 29, 38, 55, 70, 90, 105, 135, 178];
    const copperBBG = [36, 47, 59, 79, 102, 133, 158, 187];
    const copperKG = [30, 40, 50, 70, 95, 115, 140, 175];
    const copperBBGng = [36, 47, 59, 79, 102, 133, 158, 187];
    const copperWire = [27, 38, 46, 70, 85, 115, 135, 185];

    // Тооцоолол 1 фазын автомат
    for (const e of circBreaker) {
      if (e < current) continue;
      circuitBreakerCurrent = e;
      break;
    }
    // Бодсон кабелийг стандарт огтлол руу хөрвүүлэх
    const bodsonCableProcess: BodsonCableProcess = (bodson, table) => {
      if (table && bodson) {
        for (const e of table) {
          if (e < bodson) continue;
          return e;
        }
      }
    };

    const cableSizer: CableSizer = (arr) => {
      for (const e of arr) {
        if (e < circuitBreakerCurrent) continue;
        return arr.indexOf(e);
      }
    };

    if (cableType == "AC1")
      wireCableSize = sectionCable[cableSizer(alumBronCurr)];
    if (cableType == "AC2") wireCableSize = sectionCable[cableSizer(alumCurr)];
    if (cableType == "CC1") wireCableSize = sectionCable[cableSizer(copperBBG)];
    if (cableType == "CC2") wireCableSize = sectionCable[cableSizer(copperKG)];
    if (cableType == "CW") wireCableSize = sectionCable[cableSizer(copperWire)];
    if (cableType == "CCF")
      wireCableSize = sectionCable[cableSizer(copperBBGng)];

    const wireCableCalcSize = bodsonOgtlol
      ? bodsonCableProcess(bodsonOgtlol, sectionCable)
      : 0;

    let realSection = 0;

    if (wireCableSize > wireCableCalcSize) {
      console.log(
        "context-c халалтын нөхцлөөр сонгов... 220B",
        wireCableSize,
        wireCableCalcSize
      );
      wireCable = sectionCalcOnePhase(wireCableSize, cableType);
      realSection = wireCableSize;
    } else if (wireCableSize < wireCableCalcSize) {
      console.log(
        "context-c хүчдэлийн алдагдлаар сонгов... 220B",
        wireCableCalcSize,
        wireCableSize
      );
      wireCable = sectionCalcOnePhase(wireCableCalcSize, cableType);
      realSection = wireCableCalcSize;
    } else if ((!wireCableSize && !wireCableCalcSize) || !wireCable) {
      console.log("context-c аль ч огтлол нь алга даа... 220B");
      wireCable = "маркийн кабель зөвшөөрөгдөх хүчдэлийн шаардлага хангахгүй!";

      realSection = 0;
    }

    return {
      circuitBreakerCurrent,
      realSection,
      wireCable,
    };
  };

  // 380B автомат, утасны хөндлөн огтлол буцаах гол функц...
  const wireCircuitBreakerThreePhase: WireCircuitBreakerThreePhase = (
    cableType,
    current,
    bodsonOgtlol
  ) => {
    let wireCable = "";
    let wireCableSize = 0;
    let circuitBreakerCurrent = 0;
    // Таблицийн өгөгдлүүд...
    const circBreaker = [
      16, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 355, 400, 500,
      630, 800, 1000, 1600, 2000,
    ];
    const sectionCable = [
      2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240,
    ];
    const alumBronCurr = [
      26, 34, 44, 59, 77, 100, 121, 147, 178, 212, 241, 274, 312, 363,
    ];
    const alumCurr = [
      26, 34, 40, 54, 71, 102, 123, 143, 178, 212, 241, 274, 308, 355,
    ];
    const copperBBG = [
      33, 43, 54, 73, 94, 133, 158, 187, 231, 279, 302, 346, 397, 471,
    ];
    const copperKG = [
      33, 40, 50, 70, 95, 115, 140, 175, 210, 250, 290, 340, 380,
    ];
    const copperBBGng = [
      36, 47, 59, 79, 102, 133, 158, 187, 231, 279, 317, 358, 405, 471,
    ];
    const copperWire = [25, 31, 40, 50, 75, 90, 115, 150, 185, 255, 260];
    // Тооцоолол 3-н фаз...
    for (const e of circBreaker) {
      if (e < current) continue;
      circuitBreakerCurrent = e;
      break;
    }

    // Бодсон кабелийг стандарт огтлол руу хөрвүүлэх
    const bodsonCableProcess: BodsonCableProcess = (bodson, table) => {
      if (table && bodson) {
        for (const e of table) {
          if (e < bodson) continue;
          return e;
        }
      }
    };

    const cableSizer: CableSizer = (cable) => {
      for (const e of cable) {
        if (e < circuitBreakerCurrent) {
          continue;
        } else {
          console.log("context-c CableSizer функц ажиллаа: ", cable.indexOf(e));
          return cable.indexOf(e);
        }
      }
    };

    if (cableType == "AC1")
      wireCableSize = sectionCable[cableSizer(alumBronCurr)];
    if (cableType == "AC2") wireCableSize = sectionCable[cableSizer(alumCurr)];
    if (cableType == "CC1") wireCableSize = sectionCable[cableSizer(copperBBG)];
    if (cableType == "CC2") wireCableSize = sectionCable[cableSizer(copperKG)];
    if (cableType == "CW") wireCableSize = sectionCable[cableSizer(copperWire)];
    if (cableType == "CCF")
      wireCableSize = sectionCable[cableSizer(copperBBGng)];

    const wireCableCalcSize: number = bodsonOgtlol
      ? bodsonCableProcess(bodsonOgtlol, sectionCable)
      : 0;

    let realSection = 0;

    if (
      circuitBreakerCurrent > 400 ||
      !circuitBreakerCurrent ||
      circuitBreakerCurrent === 0
    ) {
      wireCable =
        "маркийн кабель халалтын нөхцлийн шаардлага хангахгүй. 2 ба түүнээс дээш хос кабель татах шаардлагатай.";
    } else {
      if (wireCableSize > wireCableCalcSize) {
        console.log(
          "context-c халалтын нөхцлөөр сонгов...",
          wireCableSize,
          wireCableCalcSize
        );
        wireCable = sectionCalcThreePhase(wireCableSize, cableType);
        realSection = wireCableSize;
      } else if (wireCableSize < wireCableCalcSize) {
        console.log(
          "context-c хүчдэлийн алдагдлаар сонгов...",
          wireCableCalcSize,
          wireCableSize
        );
        wireCable = sectionCalcThreePhase(wireCableCalcSize, cableType);
        realSection = wireCableCalcSize;
      } else if (wireCableSize == wireCableCalcSize) {
        console.log(
          "context-c 2 огтлол тэнцсэн...",
          wireCableCalcSize,
          wireCableSize
        );
        wireCable = sectionCalcThreePhase(wireCableSize, cableType);
        realSection = wireCableSize;
      } else if ((!wireCableSize && !wireCableCalcSize) || !wireCable) {
        console.log(
          "context-c аль ч огтлол нь алга даа...",
          wireCableSize,
          wireCableCalcSize
        );
        wireCable =
          "маркийн кабель зөвшөөрөгдөх хүчдэлийн шаардлага хангахгүй!";

        realSection = 0;
      }
    }

    return {
      circuitBreakerCurrent,
      realSection,
      wireCable,
    };
  };

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

  // Х.о-ыг string рүү хөрвүүлэх...
  const sectionCalcThreePhase: SectionCalcThreePhase = (section, cableType) => {
    if (cableType == "CW") {
      if (section == 2.5) return "2.5 мм.кв утас";
      if (section == 4) return "4 мм.кв утас";
      if (section == 6) return "6 мм.кв утас";
      if (section == 10) return "10 мм.кв утас";
      if (section == 16) return "16 мм.кв утас";
      if (section == 25) return "25 мм.кв утас";
      if (section == 35) return "35 мм.кв утас";
      if (section == 50) return "50 мм.кв утас";
      if (section == 70) return "70 мм.кв утас";
      if (section == 95) return "95 мм.кв утас";
      if (section == 120) return "120 мм.кв утас";
      if (section == 150) return "150 мм.кв утас";
      if (section == 185) return "185 мм.кв утас";
      if (section == 240) return "240 мм.кв утас";
    } else {
      if (section == 2.5) return "4x2.5 мм.кв";
      if (section == 4) return "4x4 мм.кв";
      if (section == 6) return "4x6 мм.кв";
      if (section == 10) return "4x10 мм.кв";
      if (section == 16) return "4x16 мм.кв";
      if (section == 25) return "3x25+1x16 мм.кв";
      if (section == 35) return "3x35+1x16 мм.кв";
      if (section == 50) return "3x50+1x25 мм.кв";
      if (section == 70) return "3x70+1x35 мм.кв";
      if (section == 95) return "3x95+1x50 мм.кв";
      if (section == 120) return "3x120+1x70 мм.кв";
      if (section == 150) return "3x150+1x70 мм.кв";
      if (section == 185) return "3x185+1x95 мм.кв";
      if (section == 240) return "3x240+1x120 мм.кв";
    }

    return "Хүчдэлийн утга болон халалтын нөхцлийн аль нэг шаардлага хангагдахгүй байна! Та өгөгдлөө шалгана уу!";
  };
  // Х.о-ыг string рүү хөрвүүлэх...
  const sectionCalcOnePhase: SectionCalcThreePhase = (section, cableType) => {
    if (cableType == "CW") {
      if (section == 2.5) return "2.5 мм.кв утас";
      if (section == 4) return "4 мм.кв утас";
      if (section == 6) return "6 мм.кв утас";
      if (section == 10) return "10 мм.кв утас";
      if (section == 16) return "16 мм.кв утас";
      if (section == 25) return "25 мм.кв утас";
      if (section == 35) return "35 мм.кв утас";
      if (section == 50) return "50 мм.кв утас";
      if (section == 70) return "70 мм.кв утас";
    } else {
      if (section == 2.5) return "2x2.5 мм.кв";
      if (section == 4) return "2x4 мм.кв";
      if (section == 6) return "2x6 мм.кв";
      if (section == 10) return "2x10 мм.кв";
      if (section == 16) return "2x16 мм.кв";
      if (section == 25) return "2x25 мм.кв";
      if (section == 35) return "2x35 мм.кв";
      if (section == 50) return "2x50 мм.кв";
      if (section == 70) return "2x70 мм.кв";
      if (section == 95) return "2x95 мм.кв";
      if (section == 120) return "2x120 мм.кв";
    }

    return "Хүчдэлийн утга болон халалтын нөхцлийн аль нэг шаардлага хангагдахгүй байна! Та өгөгдлөө шалгана уу.";
  };

  // Гүйдэл, Cosф, бүрэн чадал тодорхойлох функц...
  const currentCalc: CurrentCalc = (power, load, pfactor, cableType) => {
    let hurtver = 0;
    let huwaari = load.reduce((sum, e) => sum + e, 0);

    for (let i = 0; i < load.length; i++) {
      hurtver = hurtver + load[i] * pfactor[i];
    }
    const threeSQ = Math.sqrt(3);

    // Үндсэн параметрүүд...
    const powerFactor = hurtver / huwaari;
    const currentHuwaari = threeSQ * 380 * powerFactor;
    const current = 1000 * (power / currentHuwaari);
    const burenChadal = power / powerFactor;
    const { circuitBreakerCurrent, wireCable } = wireCircuitBreakerThreePhase(
      cableType,
      current * 1.15
    );

    return {
      current,
      burenChadal,
      powerFactor,
      circuitBreakerCurrent,
      wireCable,
    };
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

  // 380B нэг төхөөрөмжийн гүйдэл тодорхойлох функц...
  const currentOneEquipmentThreePhase: CurrentOneEquipment = (
    load,
    pf,
    cableType,
    acceptVoltage,
    length,
    starConnect
  ) => {
    let current = 0;
    let huwaari = 0;
    const threeSQ = Math.sqrt(3);
    starConnect ? (huwaari = threeSQ * 380 * pf) : (huwaari = 380 * pf);
    current = (load * 1000) / huwaari;
    const bodsonOgtlol = voltageDropThreePhase(
      load,
      acceptVoltage,
      length,
      cableType
    );

    console.log("Эхний дамжуулалт : ", bodsonOgtlol, current, cableType);
    const { circuitBreakerCurrent, realSection, wireCable } =
      wireCircuitBreakerThreePhase(cableType, current * 1.15, bodsonOgtlol);

    let c = 0;
    let hurtver = 0;
    let huvaari = 0;

    if (cableType == "AC1" || cableType == "AC2") c = 46;
    else c = 77;

    hurtver = load * length;
    huvaari = c * realSection;

    let realVoltageDrop =
      realSection == 0 || !realSection ? 0 : hurtver / huvaari;

    const obj = {
      current,
      circuitBreakerCurrent,
      realVoltageDrop,
      wireCable,
    };

    return obj;
  };

  const voltageDropThreePhase: VoltageDrop = (
    load,
    acceptVoltage,
    length,
    cableType
  ) => {
    const hurtver = load * length;
    let huwaari = 0;

    if (cableType == "AC1" || cableType == "AC2") huwaari = 46 * acceptVoltage;
    else huwaari = 77 * acceptVoltage;

    const BodsonOgtlol = hurtver / huwaari;
    return BodsonOgtlol;
  };

  // 220B нэг төхөөрөмжийн гүйдэл тодорхойлох функц...
  const currentOneEquipmentOnePhase: CurrentOneEquipment = (
    load,
    pf,
    cableType,
    acceptVoltage,
    length
  ) => {
    const huwaari = pf * 220;
    const current = (load * 1000) / huwaari;

    console.log("1 фаз ажиллаа : ", current);

    const bodsonOgtlol = voltageDropOnePhase(
      load,
      acceptVoltage,
      length,
      cableType
    );
    const { circuitBreakerCurrent, realSection, wireCable } =
      wireCircuitBreakerOnePhase(cableType, current * 1.15, bodsonOgtlol);

    let c = 0;
    let hurtver = 0;
    let huvaari = 0;

    if (cableType == "AC1" || cableType == "AC2") c = 46;
    else c = 77;

    hurtver = load * length;
    huvaari = c * realSection;

    let realVoltageDrop =
      realSection == 0 || !realSection ? 0 : hurtver / huvaari;

    const obj = {
      current,
      circuitBreakerCurrent,
      realVoltageDrop,
      wireCable,
    };

    return obj;
  };

  const voltageDropOnePhase: VoltageDrop = (
    load,
    acceptVoltage,
    length,
    cableType
  ) => {
    const hurtver = load * length;
    let huwaari = 0;

    if (cableType == "AC1" || cableType == "AC2") huwaari = 7.7 * acceptVoltage;
    else huwaari = 12.8 * acceptVoltage;

    const BodsonOgtlol = hurtver / huwaari;
    return BodsonOgtlol;
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

  return (
    <CalcContext.Provider
      value={{
        calcPlumbCoeff,
        elevatorCoeff,
        currentCalc,
        interpolation,
        currentOneEquipmentThreePhase,
        currentOneEquipmentOnePhase,
        wireCircuitBreakerThreePhase,
        ptbCalc,
        equilentPowerFactor,
      }}
    >
      {children}
    </CalcContext.Provider>
  );
};

export default CalcContext;
