import 'react-native';
import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import Connect from '../screens/Connect/Connect';
import { StyleSheet } from "react-native";
import {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { configure } from 'rsvp';

configure({ adapter: new Adapter()});

describe('Addition', () => {
    it('knows that 2 and 2 make 4', () => {
      expect(2 + 2).toBe(4);
    });
  });

  describe('Connect', () => {
    it('Should render Connect Screen component', () => {
        const styles = StyleSheet.create({
            container: {
              flex: 1,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "center"
            },
            button: {
              minWidth: "60%",
              maxWidth: "60%"
            },
            textbox: {
              minWidth: "60%",
              maxWidth: "60%"
            },
            divider: {
              height: "10%",
              backgroundColor: "#fff"
            },
            buttonText: {
              fontSize: 24,
              fontWeight: "bold",
              color: "black"
            }
          });
        
        const tree = renderer
        .create(<Connect styles={styles} />)
        .toJSON();
        expect(tree).toMatchSnapshot();
    });
  }); 

  
  describe('ValidateClassCode', () => {
      it('Should throw error for bad class code', () => {
        
        const wrapper = shallow(<Connect />);
        const { validateClassCode } = wrapper.dive().instance();
        expect(validateClassCode().toBe(false));
      });
  });      