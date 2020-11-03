import React from 'react';
import { render, cleanup } from '@testing-library/react';
import ConfirmYesNo from "./confirm-yes-no";

describe('Confirm yes/no component', () => {

  afterEach(cleanup);

  const props = {
    visible: true,
    body: 'Message',
    onYes: ()=> {},
    onNo: ()=> {},
  }

  test('Verify confirm yes/no renders with defaults', () => {
    const { getByText } = render(
        <ConfirmYesNo {...props} />
    );
    expect(getByText(props.body)).toBeInTheDocument();
    expect(getByText('Yes')).toBeInTheDocument();
    expect(getByText('No')).toBeInTheDocument();
  });

  test('Verify confirm yes/no renders with custom props', () => {
    const { getByText } = render(
        <ConfirmYesNo {...props} labelYes='altYes' labelNo='altNo' />
    );
    expect(getByText(props.body)).toBeInTheDocument();
    expect(getByText('altYes')).toBeInTheDocument();
    expect(getByText('altNo')).toBeInTheDocument();
  });

});
