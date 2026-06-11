import styled from 'styled-components';
import { theme } from '../../styles/theme';

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${theme.fontSizes.sm};
  font-weight: 500;
  color: ${theme.colors.darkGray};
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.primary};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.medicalBlue};
  }

  ${({ isValid }) => !isValid && `
    border-color: ${theme.colors.error} !important;

    &:focus {
      border-color: ${theme.colors.error} !important;
      box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
    }
  `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.sm};
  }
`;

const TextArea = styled.textarea`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.primary};
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.medicalBlue};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.sm};
  }
`;

const Select = styled.select`
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.mediumGray};
  border-radius: ${theme.spacing.md};
  font-size: ${theme.fontSizes.md};
  font-family: ${theme.fonts.primary};
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.medicalBlue};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${theme.spacing.sm};
    font-size: ${theme.fontSizes.sm};
  }
`;

function FormInput({ label, type = 'text', value, onChange, placeholder, required = false, min, max, step, maxLength, isValid = true }) {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        isValid={isValid}
      />
    </FormGroup>
  );
}

function FormTextArea({ label, value, onChange, placeholder, required = false }) {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <TextArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </FormGroup>
  );
}

function FormSelect({ label, value, onChange, children, required = false }) {
  return (
    <FormGroup>
      <Label>{label}</Label>
      <Select value={value} onChange={onChange} required={required}>
        {children}
      </Select>
    </FormGroup>
  );
}

export { FormInput, FormTextArea, FormSelect };
