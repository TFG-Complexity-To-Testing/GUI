import static org.junit.Assert.*;

import java.util.ArrayList;

public class Test0{

	@org.junit.Test
	public void test() {
		
double[] inputs={1.0,2.0,3.0,4.0,5.0};
int[] decision_inputs={1};
assertArrayEquals(new Programa(inputs,decision_inputs).get_result_bool(0,3),
				new Programa(inputs,decision_inputs).get_result_bool(0,3));

}
}
