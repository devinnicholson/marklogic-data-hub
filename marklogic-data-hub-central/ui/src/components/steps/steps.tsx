import React, {useState} from 'react';
import { Modal, Tabs } from 'antd';
import CreateEditLoad from '../load/create-edit-load/create-edit-load';
import CreateEditMapping from '../entities/mapping/create-edit-mapping/create-edit-mapping';
import ViewCustom from '../entities/custom/view-custom/view-custom';
import AdvancedSettingsDialog from "../advanced-settings/advanced-settings-dialog";
import ConfirmYesNo from '../common/confirm-yes-no/confirm-yes-no';
import styles from './steps.module.scss';
import './steps.scss';
  
const { TabPane } = Tabs;

interface Props {
    isNewStep: boolean;
    createStep?: any;
    updateStep?: any;
    stepData: any;
    sourceDatabase?: any;
    canReadWrite: any;
    canReadOnly: any;
    tooltipsData: any;
    openStepSettings: any;
    setOpenStepSettings: any;
    activityType: string;
    canWrite?: any;
}

const DEFAULT_TAB = '1';
  
const Steps: React.FC<Props> = (props) => {
    const [currentTab, setCurrentTab] = useState(DEFAULT_TAB);
    const [isValid, setIsValid] = useState(true);
    const [hasChanged, setHasChanged] = useState(false);
    const [discardChangesVisible, setDiscardChangesVisible] = useState(false);

    const onCancel = () => {
        if (hasChanged) {
            setDiscardChangesVisible(true);
        } else {
            props.setOpenStepSettings(false);
            resetTabs();
        }
    }

    const discardOk = () => {
        setDiscardChangesVisible(false);
        props.setOpenStepSettings(false);
        resetTabs();
    }
    
    const discardCancel = () => {
        setDiscardChangesVisible(false);
    }

    const discardChanges = <ConfirmYesNo
        visible={discardChangesVisible}
        body='Discard changes?'
        onYes={discardOk}
        onNo={discardCancel}
    />;

    const resetTabs = () => {
        setCurrentTab(DEFAULT_TAB);
    }

    const activityMap = {
        'ingestion': 'Loading',
        'mapping': 'Mapping',
        'custom': 'Custom',
    }

    const getTitle = () => {
        let activity = props.activityType ? activityMap[props.activityType] : '';
        return props.isNewStep ? 'New ' + activity + ' Step' : activity + ' Step Settings';
    }

    const handleTabChange = (key) => {
        setHasChanged(false);
        setCurrentTab(key);
    }

    const createEditLoad = (<CreateEditLoad
        tabKey='1'
        isNewStep={props.isNewStep}
        openStepSettings={props.openStepSettings}
        setOpenStepSettings={props.setOpenStepSettings}
        createLoadArtifact={props.createStep}
        stepData={props.stepData}
        canReadWrite={props.canReadWrite}
        canReadOnly={props.canReadOnly}
        currentTab={currentTab}
        setIsValid={setIsValid}
        resetTabs={resetTabs}
        setHasChanged={setHasChanged}
    />);

    const createEditMapping = (<CreateEditMapping
        tabKey='1'
        isNewStep={props.isNewStep}
        openStepSettings={props.openStepSettings}
        setOpenStepSettings={props.setOpenStepSettings}
        createMappingArtifact={props.createStep}
        stepData={props.stepData}
        canReadWrite={props.canReadWrite}
        canReadOnly={props.canReadOnly}
        currentTab={currentTab}
        setIsValid={setIsValid}
        resetTabs={resetTabs}
        setHasChanged={setHasChanged}
    />);

    const viewCustom = (<ViewCustom
        tabKey='1'
        openStepSettings={props.openStepSettings}
        setOpenStepSettings={props.setOpenStepSettings}
        stepData={props.stepData}
        canReadWrite={props.canReadWrite}
        canReadOnly={props.canReadOnly}
        currentTab={currentTab}
        setIsValid={setIsValid}
        resetTabs={resetTabs}
        setHasChanged={setHasChanged}
    />);

    const getCreateEditStep = (activityType) => {
        if (activityType === 'ingestion') {
            return createEditLoad;
        } else if (activityType === 'mapping') {
            return createEditMapping;
        } else {
            return viewCustom;
        }
    }

    return <Modal
        visible={props.openStepSettings}
        title={null}
        width="700px"
        onCancel={() => onCancel()}
        className={styles.SettingsModal}
        footer={null}
        maskClosable={false}
        destroyOnClose={true}
    >
        <div className={styles.settingsContainer}>
            <header>
                <div className={styles.title}>{getTitle()}</div>
            </header>
            { props.isNewStep ? <div className={styles.noTabs}>
                {getCreateEditStep(props.activityType)}
            </div> :
            <div className={styles.tabs}>
                <Tabs activeKey={currentTab} defaultActiveKey={DEFAULT_TAB} onTabClick={handleTabChange} animated={false} tabBarGutter={10}>
                    <TabPane tab="Basic" key="1" disabled={!isValid && currentTab !== '1'}>
                        {getCreateEditStep(props.activityType)}
                    </TabPane>
                    <TabPane tab="Advanced" key="2"  disabled={!isValid && currentTab !== '2'}>
                        <AdvancedSettingsDialog
                            tabKey='2'
                            tooltipsData={props.tooltipsData}
                            openStepSettings={props.openStepSettings}
                            setOpenStepSettings={props.setOpenStepSettings}
                            stepData={props.stepData}
                            updateLoadArtifact={props.updateStep}
                            activityType={props.activityType}
                            canWrite={props.canWrite}
                            currentTab={currentTab}
                            setIsValid={setIsValid}
                            resetTabs={resetTabs}
                            setHasChanged={setHasChanged}
                        />
                    </TabPane>
                </Tabs>
            </div> }
            {discardChanges}
        </div>
    </Modal>;
}

export default Steps;
  