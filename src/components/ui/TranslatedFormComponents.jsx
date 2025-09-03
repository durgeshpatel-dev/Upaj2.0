import React from 'react';
import { useEnhancedTranslation } from '../../context/EnhancedTranslationContext';
import { T } from './Translation';

/**
 * Translated Select Component for forms
 */
export const TranslatedSelect = ({ 
  options = [], 
  placeholder, 
  className = '',
  translateOptions = true,
  keyPrefix = '',
  ...props 
}) => {
  const { t } = useEnhancedTranslation();

  const getOptionLabel = (option) => {
    if (!translateOptions) return option.label || option;
    
    if (typeof option === 'string') {
      return keyPrefix ? t(`${keyPrefix}.${option}`) : option;
    }
    
    if (option.translateKey) {
      return t(option.translateKey);
    }
    
    return option.label || option.value || option;
  };

  const getOptionValue = (option) => {
    if (typeof option === 'string') return option;
    return option.value || option.label || option;
  };

  return (
    <select className={className} {...props}>
      {placeholder && (
        <option value="" disabled>
          {typeof placeholder === 'string' ? placeholder : <T k={placeholder} />}
        </option>
      )}
      {options.map((option, index) => (
        <option key={index} value={getOptionValue(option)}>
          {getOptionLabel(option)}
        </option>
      ))}
    </select>
  );
};

/**
 * Translated Label Component
 */
export const TranslatedLabel = ({ 
  k, 
  required = false, 
  className = '', 
  children,
  ...props 
}) => {
  return (
    <label className={className} {...props}>
      {k ? <T k={k} /> : children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

/**
 * Translated Input Component with built-in label
 */
export const TranslatedInput = ({ 
  label, 
  labelKey,
  required = false,
  placeholder,
  placeholderKey,
  className = '',
  inputClassName = '',
  ...props 
}) => {
  const { t } = useEnhancedTranslation();

  const getPlaceholder = () => {
    if (placeholderKey) return t(placeholderKey);
    return placeholder;
  };

  return (
    <div className={className}>
      {(label || labelKey) && (
        <TranslatedLabel 
          k={labelKey} 
          required={required}
          className="block text-text-secondary text-sm font-medium mb-2"
        >
          {label}
        </TranslatedLabel>
      )}
      <input
        placeholder={getPlaceholder()}
        className={`w-full bg-background border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${inputClassName}`}
        {...props}
      />
    </div>
  );
};

/**
 * Crop Type Select Component
 */
export const CropTypeSelect = ({ value, onChange, ...props }) => {
  const cropOptions = [
    'wheat', 'rice', 'maize', 'barley', 'soybean', 
    'cotton', 'sugarcane', 'potato', 'tomato', 'onion'
  ];

  return (
    <TranslatedSelect
      value={value}
      onChange={onChange}
      options={cropOptions}
      translateOptions={true}
      keyPrefix="crops"
      placeholder="prediction.cropType"
      {...props}
    />
  );
};

/**
 * Soil Type Select Component
 */
export const SoilTypeSelect = ({ value, onChange, ...props }) => {
  const soilOptions = [
    'clay', 'loam', 'sandy', 'silt', 'black', 'red', 'alluvial'
  ];

  return (
    <TranslatedSelect
      value={value}
      onChange={onChange}
      options={soilOptions}
      translateOptions={true}
      keyPrefix="soilTypes"
      placeholder="prediction.soilType"
      {...props}
    />
  );
};

export default {
  TranslatedSelect,
  TranslatedLabel, 
  TranslatedInput,
  CropTypeSelect,
  SoilTypeSelect
};
