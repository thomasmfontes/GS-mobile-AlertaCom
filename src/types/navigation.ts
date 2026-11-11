import { NavigatorScreenParams } from '@react-navigation/native';
import { Ocorrencia } from './incident';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  HomeTab: undefined;
  IncidentsListTab: undefined;
  NewIncidentTab: undefined;
  MyIncidentsTab: undefined;
  AboutTab: undefined;
};

export type AppStackParamList = {
  MainTabs: NavigatorScreenParams<AppTabParamList>;
  IncidentDetail: { incident: Ocorrencia };
  About: undefined;
};
