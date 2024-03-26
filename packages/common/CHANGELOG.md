# Changelog

All notable changes to the common package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

Refer to [Antv Changelog](https://www.antdv.com/docs/vue/changelog/#1.7.8).

### Guiding Principles

- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each version is displayed.

### Types of changes

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

### Date Format

Following ISO standard: YYYY-MM-DD

## Template

Below is the template of a changelog entry:

```
## 2021-12-12
#### Added
- Note for the new feature
- Something is new here

#### Changed
- Start using "something2" over "something1" since the reason

#### Deprecated
- The prop "xyz" is soon-to-be removed in the next release

#### Fixed
- Fix typos

#### Removed
- Remove the prop "abc" due to it is redundant
```

---

## 2023-09-01

### Added

- `SelectInput`: add `autocomplete` prop to return the selected values and not changed when the options are changed while searching

## 2023-05-01

### Added

- `SelectInput`, `SelectFilter`: add `searchByDependsOnValue` prop to fetch the options mapping with the `value` prop after searching return empty

## 2022-26-12

### Added

- `SelectInput`: add `defaultValue` prop to return the default value after clearing with `allowClear` prop
- `SelectFilter`: add `allowClear` prop
- `FilterDrawerComposer`: add `isAdvancedFiltered` prop to override the value of the `isAdvancedFiltered` in `vuex-crud`

## 2022-12-12

### Changed

- Remove "vuex-crud" dependency and clone this one to the project

## 2022-12-05

### Added

- `SelectFilter`: add `defaultOperator` prop to filter with the default operator

## 2022-11-23

### Added

- `ListComposer`: Display sorter from CRUD

## 2022-10-25

### Added

- `EditableLabel`: Add text ellipsis style & prop `hasTooltip` default to `false`

## 2022-10-07

### Added

- `ListComposer`: Add `defaultFilters` & `defaultQueryStrings` to handle when clearing filters and fetching data with default filters

## 2022-10-03

### Added

- `SelectInput` : Add 'show-arrow'. Hide the arrow icon when the select is disable

## 2022-09-22

### Added

- Add `TooltipField` component

## 2022-09-16

### Fixed

- `Rules` : Edit rule decimal, fractional haven't value null

## 2022-08-19

### Added

- `SelectInput`: Add prop `getPopupContainer` Fixed popup position when scrolling page up and down

## 2022-08-12

### Added

- `DatePicker`: Add prop `disabledTime` default to `false`

## 2022-08-04

### Fixed

- `EditableLabel`: Make `showEmptyValue` default to `false`

## 2022-07-04

### Fixed

- `SelectInput` remove class css 'd-flex'

## 2022-06-28

### Added

- `SelectInput` Add prop maxTagCount

## 2022-06-23

### Fixed

- Fix Messages: Rename Region to Country

## 2022-06-02

### Added

- New mixin `PayloadHandlerMixin` to serve generating fe string and generating query string when calling api

## 2022-05-24

### Added

- New component `DividerLine` to draw a divider

### Fixed

- Fix `composer` cannot generate the layout when a UI component has no property

- Correct the path to import some permission constants in the `CreateModal`

## 2022-05-16

### Added

- `DatePicker` update prop showTime

## 2022-05-06

### Changed

- Make `parsedContent` of some field components computed value so that it is updated when both `value` and `record` props change

## 2022-04-21

### Added

- `SimpleForm` Allow to clear form validation from outside via `resetForm()`

## 2022-04-14

### Added

- `WeekPicker` Add prop `showLabel` to turn on/off showing the label

### Fixed

- `WeekPicker` Week picker is showing 'Invalid date' when clearing the value

## 2022-04-05

### Added

-`IconField` Add prop `rerenderOnRecordChanged` to trigger rerender the icon-field after the record changes. This prop will be helpful when the icon-field depends on many attributes of the record

## 2022-03-31

### Changed

-`UrlField` update baseUrl is Function

## 2022-03-11

### Fixed

- `List` Align items of the filter group at the right side (including search box, advanced search button, etc) to be `end` to make it display well on the small screens.

## 2022-03-11

### Added

- `TextArea` Add prop `showLabel` to turn on/off showing the label

## 2022-03-03

### Added

- Add `RadioGroupInput` component

## 2022-02-28

### Added

- Add `FileHandlersMixin` and `downloadFile` function

## 2022-02-22

### Added

- Add G2Plot Line Chart

## 2022-02-18

### Added

- `TagField` Add some classes to serve the new colors of tag (gold-6, purple-6, geekblue-6)

### Changed

- `UrlField` Add type baseUrl is Function
- `others constants` Add field constants

## 2021-02-12

#### Fixed

- `Select Input` is missing displaying tooltip when 'formItem' equals 'false'

## 2022-02-10

#### Fixed

- Not call `fetchList` the first time when queries have the value null or undefined

## 2022-01-10

### Added

-`TextInput` Add event PressEnter

## 2022-01-07

#### Fixed

- `DateRangePickerAdd` Prevent to map a 'null' value

#### Added

- `ListComposer` Add prop `fetchOnFirstMount` to control whether it will call API to fetch list on mounted

## 2022-01-06

#### Added

- `DateRangePickerAdd` Add prop disabledDate to specify the date that cannot be selected

## 2021-12-24

#### Fixed

- If `SelectInput` has `advancedFilters` or `queries`, only call `fetchList` when all parameters are present

## 2021-12-23

#### Fixed

- Correct the token to format minute

## 2021-12-22

#### Added

- `DateRangePicker` Add prop receiveValueOnClear to receive value (null) when click on clear icon
- `KeywordFilter` Add prop allowClear to clear data

## 2021-12-16

#### Changed

- `List` Style action button

## 2021-12-13

#### Added

- `SelectFilter` supports `onSelectChange` to customize onChange handler
