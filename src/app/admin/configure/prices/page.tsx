
"use client"

import { BELayout } from "@/components/admin-panel/BELayout"
import { Heading } from "@/components/admin-panel/Heading"
import { Button } from "@/components/common/Button"
import { Card } from "@/components/common/Card"
import { Input } from "@/components/common/Input"
import SearchAndSelect from "@/components/common/SearchAndSelect"
import { useAppState } from "@/hooks/useAppState"
import useFetch from "@/hooks/useFetch"
import { IOption } from "@/types/GlobalTypes"
import {
  autoComplete,
  isEmpty,
  onOptionSelected,
  shouldRenderComponent,
} from "@/utils/utils"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip } from "react-tooltip"

const indianStates = [
  { name: "Andhra Pradesh", code: "AP" },
  { name: "Arunachal Pradesh", code: "AR" },
  { name: "Assam", code: "AS" },
  { name: "Bihar", code: "BR" },
  { name: "Chhattisgarh", code: "CG" },
  { name: "Goa", code: "GA" },
  { name: "Gujarat", code: "GJ" },
  { name: "Haryana", code: "HR" },
  { name: "Himachal Pradesh", code: "HP" },
  { name: "Jharkhand", code: "JH" },
  { name: "Karnataka", code: "KA" },
  { name: "Kerala", code: "KL" },
  { name: "Madhya Pradesh", code: "MP" },
  { name: "Maharashtra", code: "MH" },
  { name: "Manipur", code: "MN" },
  { name: "Meghalaya", code: "ML" },
  { name: "Mizoram", code: "MZ" },
  { name: "Nagaland", code: "NL" },
  { name: "Odisha", code: "OR" },
  { name: "Punjab", code: "PB" },
  { name: "Rajasthan", code: "RJ" },
  { name: "Sikkim", code: "SK" },
  { name: "Tamil Nadu", code: "TN" },
  { name: "Telangana", code: "TS" },
  { name: "Tripura", code: "TR" },
  { name: "Uttar Pradesh", code: "UP" },
  { name: "Uttarakhand", code: "UK" },
  { name: "West Bengal", code: "WB" },
  { name: "Andaman and Nicobar Islands", code: "AN" },
  { name: "Chandigarh", code: "CH" },
  { name: "Dadra and Nagar Haveli and Daman and Diu", code: "DN" },
  { name: "Delhi", code: "DL" },
  { name: "Jammu and Kashmir", code: "JK" },
  { name: "Ladakh", code: "LA" },
  { name: "Lakshadweep", code: "LD" },
  { name: "Puducherry", code: "PY" }
]

const dropDownType: IOption[] = [
  { id: "College Cutoff - UG", text: "W College Cutoff - UG" },
  { id: "College Cutoff - PG", text: "W College Cutoff - PG" },
  { id: "College Cutoff - MDS", text: "W College Cutoff - MDS" },
  { id: "College Cutoff - SS", text: "W College Cutoff - PG" },
  { id: "College Cutoff - DNB", text: "W College Cutoff - DNB" },
  { id: "College Cutoff - INICET", text: "W College Cutoff - INICET" },
  { id: "College Cutoff - AIAPGET", text: "W College Cutoff - AIAPGET (Ayurveda)" },

  { id: "All India College Cutoff - UG", text: "W All India College Cutoff - UG" },
  { id: "All India College Cutoff - MDS", text: "W All India College Cutoff - MDS" },
  { id: "All India College Cutoff - PG", text: "W All India College Cutoff - PG" },
  { id: "All India College Cutoff - SS", text: "W All India College Cutoff - SS" },
  { id: "All India College Cutoff - DNB", text: "W All India College Cutoff - DNB" },
  { id: "All India College Cutoff - INICET", text: "W All India College Cutoff - INICET" },
  { id: "All India College Cutoff - AIAPGET", text: "W All India College Cutoff - AIAPGET (Ayurveda)" },

  { id: "College Predictor", text: "College Predictor" },
// UG
  { id: "All India College Predictor-UG-MBBS", text: "All India College Predictor-UG-MBBS" },
  { id: "All India College Predictor-UG-BDS", text: "All India College Predictor-UG-BDS" },
  { id: "All India College Predictor-UG-BAMS", text: "All India College Predictor-UG-BAMS" },
  { id: "All India College Predictor-UG-BHMS", text: "All India College Predictor-UG-BHMS" },
  
  
  
  { id: "State College Predictor-UG-MBBS", text: "State College Predictor-UG-MBBS" },
  { id: "State College Predictor-UG-BDS", text: "State College Predictor-UG-BDS" },
  { id: "State College Predictor-UG-BAMS", text: "State College Predictor-UG-BAMS" },
  { id: "State College Predictor-UG-BHMS", text: "State College Predictor-UG-BHMS" },

  // PG



{ id: "All India College Predictor-PG-ALL", text: "All India College Predictor-PG-ALL" },
{ id: "All India College Predictor-PG-MD-DERMATOLOGY", text: "All India College Predictor-PG-MD-DERMATOLOGY" },
{ id: "All India College Predictor-PG-MS-ORTHOPEDICS", text: "All India College Predictor-PG-MS-ORTHOPEDICS" },
{ id: "All India College Predictor-PG-MD-PHARMACOLOGY", text: "All India College Predictor-PG-MD-PHARMACOLOGY" },
{ id: "All India College Predictor-PG-MS-OBS-AND-GYNAE", text: "All India College Predictor-PG-MS-OBS-AND-GYNAE" },
{ id: "All India College Predictor-PG-MD-PATHOLOGY", text: "All India College Predictor-PG-MD-PATHOLOGY" },
{ id: "All India College Predictor-PG-MS-GENERAL-SURGERY", text: "All India College Predictor-PG-MS-GENERAL-SURGERY" },
{ id: "All India College Predictor-PG-MD-PAEDIATRICS", text: "All India College Predictor-PG-MD-PAEDIATRICS" },
{ id: "All India College Predictor-PG-MD-GENERAL-MEDICINE", text: "All India College Predictor-PG-MD-GENERAL-MEDICINE" },
{ id: "All India College Predictor-PG-MD-ANATOMY", text: "All India College Predictor-PG-MD-ANATOMY" },
{ id: "All India College Predictor-PG-MD-COMMUNITY-MEDICINE", text: "All India College Predictor-PG-MD-COMMUNITY-MEDICINE" },
{ id: "All India College Predictor-PG-MD-PHYSIOLOGY", text: "All India College Predictor-PG-MD-PHYSIOLOGY" },
{ id: "All India College Predictor-PG-MD-BIOCHEMISTRY", text: "All India College Predictor-PG-MD-BIOCHEMISTRY" },
{ id: "All India College Predictor-PG-MD-MICROBIOLOGY", text: "All India College Predictor-PG-MD-MICROBIOLOGY" },
{ id: "All India College Predictor-PG-MD-TB-AND-CHEST", text: "All India College Predictor-PG-MD-TB-AND-CHEST" },
{ id: "All India College Predictor-PG-MD-RADIOLOGY", text: "All India College Predictor-PG-MD-RADIOLOGY" },
{ id: "All India College Predictor-PG-MD-PSYCHIATRY", text: "All India College Predictor-PG-MD-PSYCHIATRY" },
{ id: "All India College Predictor-PG-MD-EMERGENCY-MEDICINE", text: "All India College Predictor-PG-MD-EMERGENCY-MEDICINE" },
{ id: "All India College Predictor-PG-MS-OPHTHALMOLOGY", text: "All India College Predictor-PG-MS-OPHTHALMOLOGY" },
{ id: "All India College Predictor-PG-MS-ENT", text: "All India College Predictor-PG-MS-ENT" },
{ id: "All India College Predictor-PG-MD-ANAESTHESIA", text: "All India College Predictor-PG-MD-ANAESTHESIA" },
{ id: "All India College Predictor-PG-MD-FORENSIC-MEDICINE", text: "All India College Predictor-PG-MD-FORENSIC-MEDICINE" },
{ id: "All India College Predictor-PG-MD-NUCLEAR-MEDICINE", text: "All India College Predictor-PG-MD-NUCLEAR-MEDICINE" },
{ id: "All India College Predictor-PG-MD-RADIOTHERAPY", text: "All India College Predictor-PG-MD-RADIOTHERAPY" },
{ id: "All India College Predictor-PG-MD-PMR", text: "All India College Predictor-PG-MD-PMR" },
{ id: "All India College Predictor-PG-MD-GERIATRIC", text: "All India College Predictor-PG-MD-GERIATRIC" },
{ id: "All India College Predictor-PG-MD-PALLIATIVE-MEDICINE", text: "All India College Predictor-PG-MD-PALLIATIVE-MEDICINE" },
{ id: "All India College Predictor-PG-MPH-EPIDEIMOLOGY", text: "All India College Predictor-PG-MPH-EPIDEIMOLOGY" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-PAEDIATRICS", text: "All India College Predictor-PG-DIPLOMA-IN-PAEDIATRICS" },
{ id: "All India College Predictor-PG-MD-TRANSFUSION-MEDICINE", text: "All India College Predictor-PG-MD-TRANSFUSION-MEDICINE" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-ANAESTHESIA", text: "All India College Predictor-PG-DIPLOMA-IN-ANAESTHESIA" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-ORTHOPAEDICS", text: "All India College Predictor-PG-DIPLOMA-IN-ORTHOPAEDICS" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-OBS-AND-GYNAE", text: "All India College Predictor-PG-DIPLOMA-IN-OBS-AND-GYNAE" },
{ id: "All India College Predictor-PG-MD-SPORTS-MEDICINE", text: "All India College Predictor-PG-MD-SPORTS-MEDICINE" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-OPHTHALMOLOGY", text: "All India College Predictor-PG-DIPLOMA-IN-OPHTHALMOLOGY" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-PATHOLOGY", text: "All India College Predictor-PG-DIPLOMA-IN-PATHOLOGY" },
{ id: "All India College Predictor-PG-MD-TROPICAL-MEDICINE", text: "All India College Predictor-PG-MD-TROPICAL-MEDICINE" },
{ id: "All India College Predictor-PG-MD-LABORATORY-MEDICINE", text: "All India College Predictor-PG-MD-LABORATORY-MEDICINE" },
{ id: "All India College Predictor-PG-MD-FAMILY-MEDICINE", text: "All India College Predictor-PG-MD-FAMILY-MEDICINE" },
{ id: "All India College Predictor-PG-MD-HOSPITAL-ADMINISTRATION", text: "All India College Predictor-PG-MD-HOSPITAL-ADMINISTRATION" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-PSYCHIATRY", text: "All India College Predictor-PG-DIPLOMA-IN-PSYCHIATRY" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-FORENSIC-MEDICINE", text: "All India College Predictor-PG-DIPLOMA-IN-FORENSIC-MEDICINE" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-ENT", text: "All India College Predictor-PG-DIPLOMA-IN-ENT" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-DERMATOLOGY", text: "All India College Predictor-PG-DIPLOMA-IN-DERMATOLOGY" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-RADIATION-MEDICINE", text: "All India College Predictor-PG-DIPLOMA-IN-RADIATION-MEDICINE" },
{ id: "All India College Predictor-PG-MS-TRAUMATOLOGY-AND-SURGERY", text: "All India College Predictor-PG-MS-TRAUMATOLOGY-AND-SURGERY" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-RADIOTHERAPY", text: "All India College Predictor-PG-DIPLOMA-IN-RADIOTHERAPY" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-RADIOLOGY", text: "All India College Predictor-PG-DIPLOMA-IN-RADIOLOGY" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-PUBLIC-HEALTH", text: "All India College Predictor-PG-DIPLOMA-IN-PUBLIC-HEALTH" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-TB-AND-CHEST", text: "All India College Predictor-PG-DIPLOMA-IN-TB-AND-CHEST" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-DIABETOLOGY", text: "All India College Predictor-PG-DIPLOMA-IN-DIABETOLOGY" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-SPORTS-MEDICINE", text: "All India College Predictor-PG-DIPLOMA-IN-SPORTS-MEDICINE" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-BACTERIOLOGY", text: "All India College Predictor-PG-DIPLOMA-IN-BACTERIOLOGY" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-TRANSFUSION-MEDICINE", text: "All India College Predictor-PG-DIPLOMA-IN-TRANSFUSION-MEDICINE" },
{ id: "All India College Predictor-PG-MCH-NEURO-SURGERY", text: "All India College Predictor-PG-MCH-NEURO-SURGERY" },
{ id: "All India College Predictor-PG-MD-COMMUNITY-HEALTH-ADMINSTRATION", text: "All India College Predictor-PG-MD-COMMUNITY-HEALTH-ADMINSTRATION" },
{ id: "All India College Predictor-PG-DIPLOMA-IN-HEALTH-ADMINISTRATION", text: "All India College Predictor-PG-DIPLOMA-IN-HEALTH-ADMINISTRATION" },






{ id: "State College Predictor-PG-ALL", text: "State College Predictor-PG-ALL" },
{ id: "State College Predictor-PG-MD-DERMATOLOGY", text: "State College Predictor-PG-MD-DERMATOLOGY" },
{ id: "State College Predictor-PG-MS-ORTHOPEDICS", text: "State College Predictor-PG-MS-ORTHOPEDICS" },
{ id: "State College Predictor-PG-MD-PHARMACOLOGY", text: "State College Predictor-PG-MD-PHARMACOLOGY" },
{ id: "State College Predictor-PG-MS-OBS-AND-GYNAE", text: "State College Predictor-PG-MS-OBS-AND-GYNAE" },
{ id: "State College Predictor-PG-MD-PATHOLOGY", text: "State College Predictor-PG-MD-PATHOLOGY" },
{ id: "State College Predictor-PG-MS-GENERAL-SURGERY", text: "State College Predictor-PG-MS-GENERAL-SURGERY" },
{ id: "State College Predictor-PG-MD-PAEDIATRICS", text: "State College Predictor-PG-MD-PAEDIATRICS" },
{ id: "State College Predictor-PG-MD-GENERAL-MEDICINE", text: "State College Predictor-PG-MD-GENERAL-MEDICINE" },
{ id: "State College Predictor-PG-MD-ANATOMY", text: "State College Predictor-PG-MD-ANATOMY" },
{ id: "State College Predictor-PG-MD-COMMUNITY-MEDICINE", text: "State College Predictor-PG-MD-COMMUNITY-MEDICINE" },
{ id: "State College Predictor-PG-MD-PHYSIOLOGY", text: "State College Predictor-PG-MD-PHYSIOLOGY" },
{ id: "State College Predictor-PG-MD-BIOCHEMISTRY", text: "State College Predictor-PG-MD-BIOCHEMISTRY" },
{ id: "State College Predictor-PG-MD-MICROBIOLOGY", text: "State College Predictor-PG-MD-MICROBIOLOGY" },
{ id: "State College Predictor-PG-MD-TB-AND-CHEST", text: "State College Predictor-PG-MD-TB-AND-CHEST" },
{ id: "State College Predictor-PG-MD-RADIOLOGY", text: "State College Predictor-PG-MD-RADIOLOGY" },
{ id: "State College Predictor-PG-MD-PSYCHIATRY", text: "State College Predictor-PG-MD-PSYCHIATRY" },
{ id: "State College Predictor-PG-MD-EMERGENCY-MEDICINE", text: "State College Predictor-PG-MD-EMERGENCY-MEDICINE" },
{ id: "State College Predictor-PG-MS-OPHTHALMOLOGY", text: "State College Predictor-PG-MS-OPHTHALMOLOGY" },
{ id: "State College Predictor-PG-MS-ENT", text: "State College Predictor-PG-MS-ENT" },
{ id: "State College Predictor-PG-MD-ANAESTHESIA", text: "State College Predictor-PG-MD-ANAESTHESIA" },
{ id: "State College Predictor-PG-MD-FORENSIC-MEDICINE", text: "State College Predictor-PG-MD-FORENSIC-MEDICINE" },
{ id: "State College Predictor-PG-MD-NUCLEAR-MEDICINE", text: "State College Predictor-PG-MD-NUCLEAR-MEDICINE" },
{ id: "State College Predictor-PG-MD-RADIOTHERAPY", text: "State College Predictor-PG-MD-RADIOTHERAPY" },
{ id: "State College Predictor-PG-MD-PMR", text: "State College Predictor-PG-MD-PMR" },
{ id: "State College Predictor-PG-MD-GERIATRIC", text: "State College Predictor-PG-MD-GERIATRIC" },
{ id: "State College Predictor-PG-MD-PALLIATIVE-MEDICINE", text: "State College Predictor-PG-MD-PALLIATIVE-MEDICINE" },
{ id: "State College Predictor-PG-MPH-EPIDEIMOLOGY", text: "State College Predictor-PG-MPH-EPIDEIMOLOGY" },
{ id: "State College Predictor-PG-DIPLOMA-IN-PAEDIATRICS", text: "State College Predictor-PG-DIPLOMA-IN-PAEDIATRICS" },
{ id: "State College Predictor-PG-MD-TRANSFUSION-MEDICINE", text: "State College Predictor-PG-MD-TRANSFUSION-MEDICINE" },
{ id: "State College Predictor-PG-DIPLOMA-IN-ANAESTHESIA", text: "State College Predictor-PG-DIPLOMA-IN-ANAESTHESIA" },
{ id: "State College Predictor-PG-DIPLOMA-IN-ORTHOPAEDICS", text: "State College Predictor-PG-DIPLOMA-IN-ORTHOPAEDICS" },
{ id: "State College Predictor-PG-DIPLOMA-IN-OBS-AND-GYNAE", text: "State College Predictor-PG-DIPLOMA-IN-OBS-AND-GYNAE" },
{ id: "State College Predictor-PG-MD-SPORTS-MEDICINE", text: "State College Predictor-PG-MD-SPORTS-MEDICINE" },
{ id: "State College Predictor-PG-DIPLOMA-IN-OPHTHALMOLOGY", text: "State College Predictor-PG-DIPLOMA-IN-OPHTHALMOLOGY" },
{ id: "State College Predictor-PG-DIPLOMA-IN-PATHOLOGY", text: "State College Predictor-PG-DIPLOMA-IN-PATHOLOGY" },
{ id: "State College Predictor-PG-MD-TROPICAL-MEDICINE", text: "State College Predictor-PG-MD-TROPICAL-MEDICINE" },
{ id: "State College Predictor-PG-MD-LABORATORY-MEDICINE", text: "State College Predictor-PG-MD-LABORATORY-MEDICINE" },
{ id: "State College Predictor-PG-MD-FAMILY-MEDICINE", text: "State College Predictor-PG-MD-FAMILY-MEDICINE" },
{ id: "State College Predictor-PG-MD-HOSPITAL-ADMINISTRATION", text: "State College Predictor-PG-MD-HOSPITAL-ADMINISTRATION" },
{ id: "State College Predictor-PG-DIPLOMA-IN-PSYCHIATRY", text: "State College Predictor-PG-DIPLOMA-IN-PSYCHIATRY" },
{ id: "State College Predictor-PG-DIPLOMA-IN-FORENSIC-MEDICINE", text: "State College Predictor-PG-DIPLOMA-IN-FORENSIC-MEDICINE" },
{ id: "State College Predictor-PG-DIPLOMA-IN-ENT", text: "State College Predictor-PG-DIPLOMA-IN-ENT" },
{ id: "State College Predictor-PG-DIPLOMA-IN-DERMATOLOGY", text: "State College Predictor-PG-DIPLOMA-IN-DERMATOLOGY" },
{ id: "State College Predictor-PG-DIPLOMA-IN-RADIATION-MEDICINE", text: "State College Predictor-PG-DIPLOMA-IN-RADIATION-MEDICINE" },
{ id: "State College Predictor-PG-MS-TRAUMATOLOGY-AND-SURGERY", text: "State College Predictor-PG-MS-TRAUMATOLOGY-AND-SURGERY" },
{ id: "State College Predictor-PG-DIPLOMA-IN-RADIOTHERAPY", text: "State College Predictor-PG-DIPLOMA-IN-RADIOTHERAPY" },
{ id: "State College Predictor-PG-DIPLOMA-IN-RADIOLOGY", text: "State College Predictor-PG-DIPLOMA-IN-RADIOLOGY" },
{ id: "State College Predictor-PG-DIPLOMA-IN-PUBLIC-HEALTH", text: "State College Predictor-PG-DIPLOMA-IN-PUBLIC-HEALTH" },
{ id: "State College Predictor-PG-DIPLOMA-IN-TB-AND-CHEST", text: "State College Predictor-PG-DIPLOMA-IN-TB-AND-CHEST" },
{ id: "State College Predictor-PG-DIPLOMA-IN-DIABETOLOGY", text: "State College Predictor-PG-DIPLOMA-IN-DIABETOLOGY" },
{ id: "State College Predictor-PG-DIPLOMA-IN-SPORTS-MEDICINE", text: "State College Predictor-PG-DIPLOMA-IN-SPORTS-MEDICINE" },
{ id: "State College Predictor-PG-DIPLOMA-IN-BACTERIOLOGY", text: "State College Predictor-PG-DIPLOMA-IN-BACTERIOLOGY" },
{ id: "State College Predictor-PG-DIPLOMA-IN-TRANSFUSION-MEDICINE", text: "State College Predictor-PG-DIPLOMA-IN-TRANSFUSION-MEDICINE" },
{ id: "State College Predictor-PG-MCH-NEURO-SURGERY", text: "State College Predictor-PG-MCH-NEURO-SURGERY" },
{ id: "State College Predictor-PG-MD-COMMUNITY-HEALTH-ADMINSTRATION", text: "State College Predictor-PG-MD-COMMUNITY-HEALTH-ADMINSTRATION" },
{ id: "State College Predictor-PG-DIPLOMA-IN-HEALTH-ADMINISTRATION", text: "State College Predictor-PG-DIPLOMA-IN-HEALTH-ADMINISTRATION" },

// mds



{ id: "All India College Predictor-MDS-ALL", text: "All India College Predictor-MDS-ALL" },
{ id: "All India College Predictor-MDS-ORAL-MEDICINE-AND-RADIOLOGY", text: "All India College Predictor-MDS-ORAL-MEDICINE-AND-RADIOLOGY" },
{ id: "All India College Predictor-MDS-ENDODONTICS", text: "All India College Predictor-MDS-ENDODONTICS" },
{ id: "All India College Predictor-MDS-PUBLIC-HEALTH-DENTISTRY", text: "All India College Predictor-MDS-PUBLIC-HEALTH-DENTISTRY" },
{ id: "All India College Predictor-MDS-PERIODONTOLOGY", text: "All India College Predictor-MDS-PERIODONTOLOGY" },
{ id: "All India College Predictor-MDS-ORAL-AND-MAXILLOFACIAL-SURGERY", text: "All India College Predictor-MDS-ORAL-AND-MAXILLOFACIAL-SURGERY" },
{ id: "All India College Predictor-MDS-PROSTHODONTICS", text: "All India College Predictor-MDS-PROSTHODONTICS" },
{ id: "All India College Predictor-MDS-PEDODONTICS", text: "All India College Predictor-MDS-PEDODONTICS" },
{ id: "All India College Predictor-MDS-ORTHODONTICS", text: "All India College Predictor-MDS-ORTHODONTICS" },
{ id: "All India College Predictor-MDS-ORAL-PATHOLOGY-AND-MICROBIOLOGY", text: "All India College Predictor-MDS-ORAL-PATHOLOGY-AND-MICROBIOLOGY" },

{ id: "State College Predictor-MDS-ALL", text: "State College Predictor-MDS-ALL" },
{ id: "State College Predictor-MDS-ORAL-MEDICINE-AND-RADIOLOGY", text: "State College Predictor-MDS-ORAL-MEDICINE-AND-RADIOLOGY" },
{ id: "State College Predictor-MDS-ENDODONTICS", text: "State College Predictor-MDS-ENDODONTICS" },
{ id: "State College Predictor-MDS-PUBLIC-HEALTH-DENTISTRY", text: "State College Predictor-MDS-PUBLIC-HEALTH-DENTISTRY" },
{ id: "State College Predictor-MDS-PERIODONTOLOGY", text: "State College Predictor-MDS-PERIODONTOLOGY" },
{ id: "State College Predictor-MDS-ORAL-AND-MAXILLOFACIAL-SURGERY", text: "State College Predictor-MDS-ORAL-AND-MAXILLOFACIAL-SURGERY" },
{ id: "State College Predictor-MDS-PROSTHODONTICS", text: "State College Predictor-MDS-PROSTHODONTICS" },
{ id: "State College Predictor-MDS-PEDODONTICS", text: "State College Predictor-MDS-PEDODONTICS" },
{ id: "State College Predictor-MDS-ORTHODONTICS", text: "State College Predictor-MDS-ORTHODONTICS" },
{ id: "State College Predictor-MDS-ORAL-PATHOLOGY-AND-MICROBIOLOGY", text: "State College Predictor-MDS-ORAL-PATHOLOGY-AND-MICROBIOLOGY" },

// DNB





  {id:"All India College Predictor-DNB-ALL",text: "All India College Predictor-DNB-ALL"},

  {id: "All India College Predictor-DNB-ANAESTHESIOLOGY", text: "All India College Predictor-DNB-ANAESTHESIOLOGY"},
  {id: "All India College Predictor-DNB-RADIODIAGNOSIS", text: "All India College Predictor-DNB-RADIODIAGNOSIS"},
  {id: "All India College Predictor-DNB-GENERAL-SURGERY", text: "All India College Predictor-DNB-GENERAL-SURGERY"},
  {id: "All India College Predictor-DNB-ORTHOPAEDICS", text: "All India College Predictor-DNB-ORTHOPAEDICS"},
  {id: "All India College Predictor-DNB-OBS-AND-GYNAE", text: "All India College Predictor-DNB-OBS-AND-GYNAE"},
  {id: "All India College Predictor-DNB-RADIATION-ONCOLOGY", text: "All India College Predictor-DNB-RADIATION-ONCOLOGY"},
  {id: "All India College Predictor-DNB-PAEDIATRICS", text: "All India College Predictor-DNB-PAEDIATRICS"},
  {id: "All India College Predictor-DNB-GENERAL-MEDICINE", text: "All India College Predictor-DNB-GENERAL-MEDICINE"},
  {id: "All India College Predictor-DNB-RADIODIAGNOSIS-DIPLOMA", text: "All India College Predictor-DNB-RADIODIAGNOSIS-DIPLOMA"},
  {id: "All India College Predictor-DNB-ANAESTHESIOLOGY-DIPLOMA", text: "All India College Predictor-DNB-ANAESTHESIOLOGY-DIPLOMA"},
  {id: "All India College Predictor-DNB-EMERGENCY-MEDICINE", text: "All India College Predictor-DNB-EMERGENCY-MEDICINE"},
  {id: "All India College Predictor-DNB-OPHTHALMOLOGY-DIPLOMA", text: "All India College Predictor-DNB-OPHTHALMOLOGY-DIPLOMA"},
  {id: "All India College Predictor-DNB-NEURO-SURGERY", text: "All India College Predictor-DNB-NEURO-SURGERY"},
  {id: "All India College Predictor-DNB-OBS-AND-GYNAE-DIPLOMA", text: "All India College Predictor-DNB-OBS-AND-GYNAE-DIPLOMA"},
  {id: "All India College Predictor-DNB-FAMILY-MEDICINE", text: "All India College Predictor-DNB-FAMILY-MEDICINE"},
  {id: "All India College Predictor-DNB-ENT", text: "All India College Predictor-DNB-ENT"},
  {id: "All India College Predictor-DNB-OPHTHALMOLOGY", text: "All India College Predictor-DNB-OPHTHALMOLOGY"},
  {id: "All India College Predictor-DNB-FAMILY-MEDICINE-DIPLOMA", text: "All India College Predictor-DNB-FAMILY-MEDICINE-DIPLOMA"},
  {id: "All India College Predictor-DNB-PAEDIATRICS-DIPLOMA", text: "All India College Predictor-DNB-PAEDIATRICS-DIPLOMA"},
  {id: "All India College Predictor-DNB-NUCLEAR-MEDICINE", text: "All India College Predictor-DNB-NUCLEAR-MEDICINE"},
  {id: "All India College Predictor-DNB-TB-AND-CHEST", text: "All India College Predictor-DNB-TB-AND-CHEST"},
  {id: "All India College Predictor-DNB-TB-AND-CHEST-DIPLOMA", text: "All India College Predictor-DNB-TB-AND-CHEST-DIPLOMA"},
  {id: "All India College Predictor-DNB-PLASTIC-AND-RECONSTRUCTIVE-SURGERY", text: "All India College Predictor-DNB-PLASTIC-AND-RECONSTRUCTIVE-SURGERY"},
  {id: "All India College Predictor-DNB-PATHOLOGY", text: "All India College Predictor-DNB-PATHOLOGY"},
  {id: "All India College Predictor-DNB-TRANSFUSION-MEDICINE", text: "All India College Predictor-DNB-TRANSFUSION-MEDICINE"},
  {id: "All India College Predictor-DNB-CARDIO-VASCULARAND-THORACIC-SURGERY", text: "All India College Predictor-DNB-CARDIO-VASCULARAND-THORACIC-SURGERY"},
  {id: "All India College Predictor-DNB-MICROBIOLOGY", text: "All India College Predictor-DNB-MICROBIOLOGY"},
  {id: "All India College Predictor-DNB-PSYCHIATRY", text: "All India College Predictor-DNB-PSYCHIATRY"},
  {id: "All India College Predictor-DNB-PHYSIOLOGY", text: "All India College Predictor-DNB-PHYSIOLOGY"},
  {id: "All India College Predictor-DNB-COMMUNITY-MEDICINE", text: "All India College Predictor-DNB-COMMUNITY-MEDICINE"},
  {id: "All India College Predictor-DNB-PHARMACOLOGY", text: "All India College Predictor-DNB-PHARMACOLOGY"},
  {id: "All India College Predictor-DNB-DERMATOLOGY", text: "All India College Predictor-DNB-DERMATOLOGY"},
  {id: "All India College Predictor-DNB-PALLIATIVE-MEDICINE", text: "All India College Predictor-DNB-PALLIATIVE-MEDICINE"},
  {id: "All India College Predictor-DNB-PAEDIATRIC-SURGERY", text: "All India College Predictor-DNB-PAEDIATRIC-SURGERY"},
  {id: "All India College Predictor-DNB-GERIATRIC-MEDICINE", text: "All India College Predictor-DNB-GERIATRIC-MEDICINE"},
  {id: "All India College Predictor-DNB-BIOCHEMISTRY", text: "All India College Predictor-DNB-BIOCHEMISTRY"},
  {id: "All India College Predictor-DNB-FORENSIC-MEDICINE", text: "All India College Predictor-DNB-FORENSIC-MEDICINE"},
  {id: "All India College Predictor-DNB-HOSPITAL-ADMINISTRATION", text: "All India College Predictor-DNB-HOSPITAL-ADMINISTRATION"},
  {id: "All India College Predictor-DNB-PMR", text: "All India College Predictor-DNB-PMR"},
  {id: "All India College Predictor-DNB-ANATOMY", text: "All India College Predictor-DNB-ANATOMY"},
  {id: "All India College Predictor-DNB-EMERGENCY-MEDICINE-DIPLOMA", text: "All India College Predictor-DNB-EMERGENCY-MEDICINE-DIPLOMA"},

  
  { id: "Single College Closing Rank - UG", text: "Single College Closing Rank - UG" },
  { id: "Single College Closing Rank - PG", text: "Single College Closing Rank - PG" },
  { id: "Single College Closing Rank - MDS", text: "Single College Closing Rank - MDS" },
  { id: "Single College Closing Rank - SS", text: "Single College Closing Rank - SS" },
  { id: "Single College Closing Rank - DNB", text: "Single College Closing Rank - DNB" },
  { id: "Single College Closing Rank - INICET", text: "Single College Closing Rank - INICET" },
  { id: "Single College Closing Rank - AIAPGET", text: "Single College Closing Rank - AIAPGET (Ayurved)" },
  
  { id: "State Closing Rank - UG", text: "State Closing Rank - UG" },
  { id: "State Closing Rank - PG", text: "State Closing Rank - PG" },
  { id: "State Closing Rank - MDS", text: "State Closing Rank - MDS" },
  { id: "State Closing Rank - SS", text: "State Closing Rank - SS" },
  { id: "State Closing Rank - DNB", text: "State Closing Rank - DNB" },
  { id: "State Closing Rank - INICET", text: "State Closing Rank - INICET" },
  { id: "State Closing Rank - AIAPGET", text: "State Closing Rank - AIAPGET" },

  { id: "All India Closing Rank - UG", text: "All India Closing Rank - UG" },
  { id: "All India Closing Rank - PG", text: "All India Closing Rank - PG" },
  { id: "All India Closing Rank - MDS", text: "All India Closing Rank - MDS" },
  { id: "All India Closing Rank - DNB", text: "All India Closing Rank - DNB" },
  { id: "All India Closing Rank - INICET", text: "All India Closing Rank - INICET" },
  { id: "All India Closing Rank - AIAPGET", text: "All India Closing Rank - AIAPGET (Ayurveda)" },
  { id: "All India Closing Rank - SS", text: "All India Closing Rank - SS" },
  
  { id: "Packages", text: "Packages" },
]

export default function ConfigurePricesPage() {
  const [configList, setConfigList] = useState<any[]>([])
  const [initialConfigList, setInitialConfigList] = useState<any[]>([])
  const [selectedType, setSelectedType] = useState<IOption | undefined>()
  const [bulkPrice, setBulkPrice] = useState<string>("")
  const [isBulkLoading, setIsBulkLoading] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [addValues, setAddValues] = useState<{ [code: string]: string }>({})

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({ shouldFocusError: true })
  const { fetchData } = useFetch()
  const { showToast } = useAppState()
  const { appState } = useAppState()
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (selectedType) getData(selectedType?.id)
    setBulkPrice("")
    setAddValues({})
    setEditIndex(null)
    setEditValue("")
  }, [selectedType])

  async function getData(type: string) {
    const res = await fetchData({
      url: "/api/admin/configure_prices/get",
      params: { type },
    })
    if (res?.success) {
      setConfigList(res?.payload?.data || [])
      setInitialConfigList(res?.payload?.data || [])
    }
  }

  function updateText(index: number, text: string) {
    setConfigList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, price: text } : item)),
    )
  }

  // Single update
  async function updateData(id?: string, price?: string) {
    if (!id || !String(price)?.trim()) return
    const res = await fetchData({
      url: "/api/admin/configure_prices/update",
      method: "POST",
      data: { id, price: Number(price) },
    })

    if (res?.success) {
      showToast("success", "Updated successfully")
      getData(selectedType!.id)
      setEditIndex(null)
      setEditValue("")
    }
  }

  // Bulk update
  async function handleBulkUpdate() {
    if (!bulkPrice || isNaN(Number(bulkPrice))) {
      showToast("error", "Enter a valid price")
      return
    }
    setIsBulkLoading(true)
    try {
      await fetchData({
        url: "/api/admin/configure_prices/update",
        method: "POST",
        data: {
          price: Number(bulkPrice),
          type: selectedType?.id,
          isBulkUpdate: true,
        },
      })
      showToast("success", "Bulk prices updated for all states")
      getData(selectedType!.id)
      setBulkPrice("")
    } catch (e) {
      showToast("error", "Bulk update failed")
    } finally {
      setIsBulkLoading(false)
    }
  }

  // Bulk add prices for all states
  async function handleBulkAdd() {
    if (!bulkPrice || isNaN(Number(bulkPrice))) {
      showToast("error", "Enter a valid price")
      return
    }
    setIsBulkLoading(true)
    try {
      await fetchData({
        url: "/api/admin/configure_prices/add",
        method: "POST",
        data: {
          price: Number(bulkPrice),
          type: selectedType?.id,
          isBulkAdd: true,
        },
      })
      showToast("success", "Bulk prices added for all states")
      getData(selectedType!.id)
      setBulkPrice("")
      setAddValues({})
    } catch (e) {
      showToast("error", "Bulk add failed")
    } finally {
      setIsBulkLoading(false)
    }
  }

  // Add price for a single state
  async function handleSingleAdd(state: any, price: string) {
    if (!price || isNaN(Number(price))) {
      showToast("error", "Enter a valid price")
      return
    }
    await fetchData({
      url: "/api/admin/configure_prices/add",
      method: "POST",
      data: {
        item: state,
        price: Number(price),
        type: selectedType?.id,
      },
    })
    getData(selectedType!.id)
    setAddValues((prev) => ({ ...prev, [state?.code]: "" }))
  }

  // States for which price is already set
  const statesWithPrice = new Set(configList.map((c) => c.item?.code))

  return (
    <BELayout className="mb-10 tab:mb-0">
      <Heading>Configure Prices</Heading>

      <Card className="mt-4 p-6 min-h-[500px]">
        <div className="w-full max-w-96">
          <SearchAndSelect
            name="dropDownType"
            label="Select Option"
            placeholder="Select Option"
            listOptionClass="max-h-96"
            value={selectedType}
            onChange={({ name, selectedValue }) => {
              onOptionSelected(name, selectedValue, () => {})
              setSelectedType(selectedValue)
            }}
            control={control}
            setValue={setValue}
            required
            options={dropDownType}
            debounceDelay={0}
            searchAPI={(text, setOptions) =>
              autoComplete(text, dropDownType, setOptions)
            }
            errors={errors}
          />
        </div>

        {shouldRenderComponent([selectedType], "AND") && (
          <form className="w-full">
            <div className="text-xl text-color-text mt-8 mb-4">
              {selectedType?.text} Price
            </div>

            {/* If no prices, show add for all states */}
            {isEmpty(configList) && !appState.isLoading ? (
              <div className="flex flex-col gap-4 mt-6">
                <div className="text-sm text-color-subtext mb-2">
                  Add Prices for Each State:
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Input
                    name="bulkPrice"
                    placeholder="Bulk price for all states"
                    type="number"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    control={control}
                    setValue={setValue}
                    boxWrapperClass="h-[40px]"
                    wrapperClass="w-[200px]"
                  errors={errors}
                  />
                  <Button
                    type="button"
                    onClick={handleBulkAdd}
                    // loading={isBulkLoading}
                    disabled={isBulkLoading || !bulkPrice}
                  >
                    Set All States
                  </Button>
                </div>
                {indianStates.map((state, index) => (
                  <div key={index} className="flex items-center gap-2 max-w-[400px]">
                    <div className="w-[200px] text-sm">{state.name}</div>
                    <Input
                      name={`state-${index}`}
                      placeholder="Enter price"
                      type="number"
                        errors={errors}
                      value={addValues[state?.code] || ""}
                      onChange={(e) =>
                        setAddValues((prev) => ({
                          ...prev,
                          [state?.code]: e.target.value,
                        }))
                      }
                      control={control}
                      setValue={setValue}
                      boxWrapperClass="h-[40px]"
                      wrapperClass="w-full"
                    />
                    <Button
                      type="button"
                      // size="sm"
                      onClick={async () => {
                        await handleSingleAdd(state, addValues[state?.code]);
                      }}
                      disabled={!addValues[state?.code]}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              // If prices exist, show editable list
              <ul
                ref={listRef}
                className="flex flex-col gap-6 w-full max-w-[400px] max-h-[calc(100vh-500px)] overflow-y-auto"
              >
                {configList?.map(({ id, item, price }, index) => (
                  <li
                    key={id || index}
                    className="grid grid-cols-[1fr_120px_80px] items-center text-color-subtext py-2 mr-4 text-sm border-t border-b border-color-border"
                  >
                    <div>{item?.name || item}</div>
                    {editIndex === index ? (
                      <>
                        <Input
                          name={`edit-${index}`}
                          placeholder="Enter here"
                          value={editValue}
                          type="number"
                          setValue={setValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          control={control}
                          errors={errors}
                          boxWrapperClass="h-[40px]"
                          wrapperClass="w-full"
                        />
                        <Button
                          type="button"
                          // size="sm"
                          onClick={() => updateData(id, editValue)}
                          disabled={!editValue || editValue === price}
                        >
                          Update
                        </Button>
                        <Button
                          type="button"
                          // size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditIndex(null)
                            setEditValue("")
                          }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="w-full">{price}</div>
                        <Button
                          type="button"
                          // size="sm"
                          onClick={() => {
                            setEditIndex(index)
                            setEditValue(price)
                          }}
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {/* Bulk update for existing prices */}
            {!isEmpty(configList) && (
              <div className="flex items-center gap-2 mt-8">
                <Input
                  name="bulkUpdate"
                  placeholder="Bulk update price for all states"
                  type="number"
                  value={bulkPrice}
                  onChange={(e) => setBulkPrice(e.target.value)}
                  control={control}
                  setValue={setValue}
                  boxWrapperClass="h-[40px]"
                  wrapperClass="w-[200px]"
                    errors={errors}
                />
                <Button
                  type="button"
                  onClick={handleBulkUpdate}
                  // loading={isBulkLoading}
                  disabled={isBulkLoading || !bulkPrice}
                >
                  Update All States
                </Button>
              </div>
            )}
          </form>
        )}
      </Card>

      <Tooltip id="tooltip" place="top" className="z-[1100]" />
    </BELayout>
  )
}