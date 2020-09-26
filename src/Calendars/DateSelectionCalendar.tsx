import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import BaseCalendarWrappedInProviders from './Providers';
import type { DateProperties, WrapperCalendarProps } from '../Entities';

dayjs.extend(utc);

interface SpecificProps {
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

type Props = SpecificProps & WrapperCalendarProps;

// A thin wrapper to limit the props that can be passed to the BaseCalendar component
const DateSelectionCalendar: React.FC<Props> = ({
  onSelectDate,
  disabledDates,
  selectedDate,
  initVisibleDate,
  allowYearView = true,
  ...others
}) => {
  const dateProperties = useMemo(() => {
    let disabledDateProperties: Record<string, DateProperties> = {};
    let selectedDateProperties: Record<string, DateProperties> = {};

    disabledDateProperties = (disabledDates as string[])?.reduce(
      (disabled: Record<string, DateProperties>, date) => {
        disabled[date] = { isDisabled: true };
        return disabled;
      },
      {}
    );

    if (dayjs(selectedDate).isValid()) {
      selectedDateProperties = {
        [dayjs(selectedDate).local().format('YYYY-MM-DD')]: {
          isSelected: true,
        },
      };
    }

    // Not possible for a date to be both disabled and selected, so overwriting is OK
    return {
      ...disabledDateProperties,
      ...selectedDateProperties,
    };
  }, [selectedDate, disabledDates]);

  return (
    <BaseCalendarWrappedInProviders
      allowYearView={allowYearView}
      onPressDay={onSelectDate}
      initVisibleDate={
        initVisibleDate || (dayjs(selectedDate).isValid() ? selectedDate : undefined)
      }
      dateProperties={dateProperties}
      {...others}
    />
  );
};

export default DateSelectionCalendar;
