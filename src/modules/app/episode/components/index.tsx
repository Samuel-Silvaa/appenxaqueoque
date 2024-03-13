import Acuteness from './acuteness/Acuteness';
import Datetime from './datetime/Datetime';
import ImprovementFactor from './improvementFactor/ImprovementFactor';
import Location from './location/Location';
import Notes from './notes/Notes';
import PainType from './painType/PainType';
import Period from './period/Period';
import Symptoms from './symptoms/Symptoms';
import Trigger from './trigger/Trigger';

const FormSteps = {
  Datetime: Datetime,
  Location: Location,
  Acuteness: Acuteness,
  Notes: Notes,
  ImprovementFactor: ImprovementFactor,
  Period: Period,
  PainType: PainType,
  Trigger: Trigger,
  Symptoms: Symptoms,
};

export default FormSteps;
