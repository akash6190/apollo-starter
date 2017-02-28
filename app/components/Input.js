import React from 'react';
import Input from 'react-toolbox/lib/input';

const InputField = ({ meta, input, ...otherProps }) => ( // eslint-disable-line react/prop-types
  <Input
    error={meta.error}
    floating
    {...input}
    {...otherProps}
  />
);

export default InputField;
