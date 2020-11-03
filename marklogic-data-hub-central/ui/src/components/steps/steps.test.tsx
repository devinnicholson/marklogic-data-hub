import React from 'react';
import { fireEvent, render, wait, cleanup, act } from "@testing-library/react";
import Steps from './Steps';
import axiosMock from 'axios';
import mocks from '../../api/__mocks__/mocks.data';
import data from '../../assets/mock-data/curation/advanced-settings.data';

jest.mock('axios');

describe("Steps settings component", () => {

    beforeEach(() => {
        mocks.advancedAPI(axiosMock);
      });

    afterEach(() => {
        jest.clearAllMocks();
        cleanup();
    });

    const stepLoad = data.stepLoad.data
    const stepMapping = data.stepMapping.data
    const stepCustom = {...data.stepLoad.data, stepDefinitionName:'custom-ingestion', name: 'CustomLoad'}

    const stepsProps = {
        isNewStep: false,
        createStep: jest.fn(),
        updateStep: jest.fn(),
        stepData: {},
        sourceDatabase: '',
        canReadWrite: true,
        canReadOnly: true,
        tooltipsData: {},
        openStepSettings: true,
        setOpenStepSettings: jest.fn(),
        activityType: '',
        canWrite: true
    }

    test('Verify rendering of Load step and tab functionality', async () => {
        const { getByText, getByLabelText, getByPlaceholderText } = render(
            <Steps {...stepsProps} activityType='ingestion' stepData={stepLoad} />
        );

        expect(getByText('Loading Step Settings')).toBeInTheDocument();
        expect(getByLabelText('Close')).toBeInTheDocument();

        // Default Basic tab
        expect(getByText('Basic')).toHaveClass('ant-tabs-tab-active');
        expect(getByText('Advanced')).not.toHaveClass('ant-tabs-tab-active');
        // Basic settings details tested in create-edit-*.test.tsx

        // Switch to Advanced tab
        await wait(() => {
            fireEvent.click(getByText('Advanced'));
        });
        expect(getByText('Basic')).not.toHaveClass('ant-tabs-tab-active');
        expect(getByText('Advanced')).toHaveClass('ant-tabs-tab-active');
        // Advanced settings details tested in advanced-settings-dialog.test.tsx

        // Change form content
        fireEvent.change(getByPlaceholderText('Please enter target permissions'), { target: { value: 'permissions-changed' }});

        // Switch back to Basic tab, verify save confirm dialog
        fireEvent.click(getByText('Basic'));
        expect(getByText('Save changes?')).toBeInTheDocument();
        expect(getByText('Yes')).toBeInTheDocument();
        expect(getByText('No')).toBeInTheDocument();
    
        const noButton = getByText('No');
        noButton.onclick = jest.fn();
        fireEvent.click(noButton);
        expect(noButton.onclick).toHaveBeenCalledTimes(1);
    
        const yesButton = getByText('Yes');
        yesButton.onclick = jest.fn();
        fireEvent.click(yesButton);
        expect(yesButton.onclick).toHaveBeenCalledTimes(1);

    });

    test('Verify rendering of Mapping step', async () => {
        const { getByText, getByLabelText } = render(
            <Steps {...stepsProps} activityType='mapping' stepData={stepMapping} />
        );

        expect(getByText('Mapping Step Settings')).toBeInTheDocument();
        expect(getByLabelText('Close')).toBeInTheDocument();
    });

    test('Verify rendering of Custom step', async () => {
        const { getByText, getByLabelText } = render(
            <Steps {...stepsProps} activityType='custom' stepData={stepCustom} />
        );

        expect(getByText('Custom Step Settings')).toBeInTheDocument();
        expect(getByLabelText('Close')).toBeInTheDocument();
    });

    // NOTE: hasChanged and isValid info not being correctly passed from child to parent in RTL unit tests.
    // Therefore, test the following in e2e tests:
    // - Clicking Close button with unsaved changes warns with "Discard changes?"
    // - Errors in form within a tab disables other tab(s)


});
